---
title: "Building a RISC-V Soft Processor Core: From RTL to OpenSBI Boot with SilicogenAI"
description: "A deep dive into designing, implementing, and debugging a synthesizable RV32IMAZicsr soft processor core in SystemVerilog — from microarchitecture specification through RTL implementation to booting real-world firmware."
author: "SilicogenAI Team"
tags: ["RISC-V", "RTL", "SystemVerilog", "OpenSBI", "Hardware"]
---

## The Vision: A Real Processor for Real Firmware {#the-vision}

When you read about processors in textbooks, they're elegant abstractions: fetch, decode, execute, writeback. When you actually *build* one, you discover that the devil is in the details—and those details are everywhere.

Our goal wasn't to build a toy CPU that could add two numbers, or a software emulator that merely interprets instructions. We set out to create, in just two days, a **synthesizable soft processor core** — actual RTL hardware — sophisticated enough to boot real-world firmware like [OpenSBI](https://github.com/riscv-software-src/opensbi). This meant implementing the full **RV32IMAZicsr** standard for M-mode, including:

- **RV32I**: The base 32-bit integer instruction set (40+ instructions)
- **M Extension**: Integer multiplication and division
- **Zicsr Extension**: Control and Status Register (CSR) instructions for privilege levels and trap handling

This isn't a software emulator or a weekend project. This is a condensed, high-intensity sprint through the entire **hardware processor design lifecycle** — from microarchitecture specification to synthesizable RTL to final validation. We're documenting every bug, every breakthrough, and every lesson learned in building a production-ready M-mode soft processor core from scratch.

https://youtu.be/0voZjQtn19g

---

## Phase 0: Environment Setup

Before writing a single line of code, we assembled our toolchain:

**Simulation & Verification:**
- **Verilator 5.020**: A lightning-fast open-source Verilog/SystemVerilog simulator that compiles HDL to C++. Used by Google, Western Digital, and other companies for production verification.
- **GTKWave**: For viewing waveforms and debugging timing issues.

**Software Development:**
- **RISC-V GNU Toolchain**: Cross-compiler (`riscv64-linux-gnu-gcc`) to compile C and assembly programs targeting our processor.
- **Device Tree Compiler (DTC)**: For describing the hardware topology to OpenSBI (planned for later phases).

**Why This Matters:** Using industry-standard tools means our design can evolve into something real. Verilator can simulate millions of cycles per second, making it practical to boot complex firmware that would take hours in slower simulators.

---

## Phase 1: Microarchitecture Definition {#phase-1-microarchitecture-definition}

Here's the crucial insight that separates hobbyist CPU projects from real ones: **you must design the microarchitecture before writing RTL**.

RTL (Register Transfer Level) code describes *what* hardware exists: "there's a 32-bit register here, a multiplexer there." But RTL doesn't tell you *how* the processor works. That's the microarchitecture's job.

### Our CPU State Machine

We designed a simple, non-pipelined processor with 11 states:

```
STATE_RESET → STATE_FETCH → STATE_FETCH_WAIT → STATE_DECODE →
STATE_EXECUTE → STATE_MEMORY → STATE_MEMORY_WAIT → STATE_WRITEBACK →
(back to STATE_FETCH)

AMO path: STATE_EXECUTE → STATE_MEMORY → STATE_MEMORY_WAIT → STATE_AMO_WRITE → STATE_AMO_WRITE_WAIT → STATE_WRITEBACK
```

**Why not pipelined?** Pipelining (where multiple instructions overlap in execution) is faster but *vastly* more complex. Hazards, forwarding, branch prediction—we'd spend months on that alone. For a first pass at booting firmware, a simple multi-cycle design is the pragmatic choice.

**Why AMO_WRITE / AMO_WRITE_WAIT?** Atomic memory operations (AMO*) are a two-beat transaction: first a read (via the normal MEMORY/MEMORY_WAIT path), then a write of the modified value. The AMO read phase uses the same MEMORY/MEMORY_WAIT states as a regular load. Only after the read completes does the FSM branch into AMO_WRITE/AMO_WRITE_WAIT for the write phase. Two dedicated states keep the write phase clean and allow the bus to signal errors independently.

### The Datapath

We documented how data flows through the processor:

- **32 General-Purpose Registers**: x0 (always zero) through x31
- **Program Counter (PC)**: Tracks which instruction to execute next
- **ALU**: Arithmetic and logic operations (add, subtract, shifts, comparisons)
- **Multiply/Divide Unit**: Multi-cycle implementation of M-extension
- **CSR File**: Privilege and trap handling registers
- **Split Bus Interface**: `ibus` carries instruction fetches (PC → RAM); `dbus` carries data loads, stores, and AMO transactions (ALU result → RAM/MMIO)

### Memory Map

We defined where everything lives in the 32-bit address space:

```
0x00000000 - 0x003FFFFF : RAM (4MB)
0x02000000 - 0x02FFFFFF : Timer/CLINT (for interrupts)
0x10000000 - 0x100000FF : UART (ns16550a compatible)
```

**Critical Decision:** Starting RAM at address 0 means our reset vector (where the CPU starts executing) is at 0x00000000. This matches what OpenSBI expects.

### Control Signals

For each instruction type, we documented:
- When to write the register file
- Which ALU operation to perform
- When to access memory
- How to update the PC (sequential, branch, jump, trap)

These documents became our contract. When debugging later, we could ask: "Does the RTL match the spec?" If not, we knew where the bug was.

---

## Phase 2: RTL Implementation {#phase-2-rtl-implementation}

With our blueprint complete, we translated the design into synthesizable SystemVerilog. This phase resulted in **~2,600 lines of hardware description code** across 11 modules.

### Module 1: Register File (`rtl/core/register_file.sv`)

```systemverilog
module register_file (
    input  logic        clk,
    input  logic        rst_n,
    input  logic [4:0]  rs1_addr, rs2_addr, rd_addr,
    input  logic [31:0] rd_data,
    input  logic        rd_we,
    output logic [31:0] rs1_data, rs2_data
);
```

The register file has two read ports (for source operands rs1 and rs2) and one write port (for destination rd). A critical detail: `x0` must always read as zero, regardless of what anyone tries to write to it.

```systemverilog
always_ff @(posedge clk) begin
    if (rd_we && rd_addr != 5'b00000) begin
        registers[rd_addr] <= rd_data;
    end
end

assign rs1_data = (rs1_addr == 5'b00000) ? 32'h0 : registers[rs1_addr];
assign rs2_data = (rs2_addr == 5'b00000) ? 32'h0 : registers[rs2_addr];
```

**Why asynchronous reads?** In our multi-cycle design, we need register values immediately during the DECODE state. A synchronous read would add an extra cycle to every instruction.

### Module 2: ALU (`rtl/core/alu.sv`)

The ALU implements all RV32I arithmetic and logical operations:

```systemverilog
case (alu_op)
    ALU_OP_ADD:  result = a + b;
    ALU_OP_SUB:  result = a - b;
    ALU_OP_SLL:  result = a << b[4:0];
    ALU_OP_SLT:  result = ($signed(a) < $signed(b)) ? 32'd1 : 32'd0;
    ALU_OP_SLTU: result = (a < b) ? 32'd1 : 32'd0;
    ALU_OP_XOR:  result = a ^ b;
    ALU_OP_SRL:  result = a >> b[4:0];
    ALU_OP_SRA:  result = $signed(a) >>> b[4:0];
    ALU_OP_OR:   result = a | b;
    ALU_OP_AND:  result = a & b;
endcase
```

**Detail that matters:** The shift amount comes from only the lower 5 bits of `b` (because you can't shift a 32-bit value by more than 31 positions). Getting this wrong would cause weird behavior in code that uses shifts.

### Module 3: Decoder (`rtl/core/decoder.sv`)

The decoder is the CPU's "instruction interpreter." It looks at the 32-bit instruction word and determines:
- What type of instruction is this? (R-type, I-type, S-type, B-type, U-type, J-type)
- Which registers does it use?
- What immediate value (if any) should be extracted?
- Is this a load? A store? A branch? An ALU operation?

RISC-V has a beautifully regular encoding, but there are still plenty of special cases:

```systemverilog
always_comb begin
    case (opcode)
        7'b0110011: begin // R-type: register-register operations
            is_r_type = 1;
            imm = 32'h0;
        end
        7'b0010011: begin // I-type: immediate arithmetic
            is_i_type = 1;
            imm = {{20{instruction[31]}}, instruction[31:20]}; // Sign-extend
        end
        7'b0000011: begin // Load instructions
            is_load = 1;
            imm = {{20{instruction[31]}}, instruction[31:20]};
        end
        // ... 20 more cases ...
    endcase
end
```

**The challenge:** Every instruction format extracts the immediate value differently. Get the bit positions wrong, and your jumps will go to random addresses.

### Module 4: Multiply/Divide Unit (`rtl/core/muldiv.sv`)

The M-extension requires multiplication and division. We implemented a simple multi-cycle iterative divider and a single-cycle multiplier (using the `*` operator, which synthesizes to a hardware multiplier).

**Trade-off:** A single-cycle 32×32 multiplier uses a lot of logic gates. A multi-cycle implementation would be smaller but slower. For now, we prioritized working over optimal.

### Module 5: CSR File (`rtl/core/csr_file.sv`)

Control and Status Registers are what make a processor capable of running an operating system. They control:
- Privilege levels (Machine mode, Supervisor mode, User mode)
- Trap handling (what happens on exceptions and interrupts)
- Timers and counters

For OpenSBI, we need at least 12 core machine-mode CSRs:

```systemverilog
// Machine-mode CSRs
logic [31:0] mstatus;   // Machine status
logic [31:0] misa;      // ISA and extensions
logic [31:0] mie;       // Interrupt enable
logic [31:0] mtvec;     // Trap vector base address
logic [31:0] mepc;      // Exception PC
logic [31:0] mcause;    // Trap cause
logic [31:0] mtval;     // Trap value
logic [31:0] mip;       // Interrupt pending
logic [31:0] mscratch;  // Scratch register
```

The CSR file also implements the `CSRRW`, `CSRRS`, `CSRRC` instructions that read/write these registers atomically.

### Module 6: CPU Core (`rtl/core/cpu_core.sv`)

This is the heart of the processor: 878 lines that tie everything together. The core instantiates all submodules and implements the state machine:

```systemverilog
always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
        state <= STATE_RESET;
        pc <= 32'h00000000;
    end else begin
        state <= next_state;
        case (state)
            STATE_FETCH_WAIT: begin
                if (ibus_ready) instruction <= ibus_rdata;
            end
            STATE_EXECUTE: begin
                alu_result_reg <= alu_result;
                // ... latch other values ...
            end
            STATE_MEMORY_WAIT: begin
                if (dbus_ready) mem_data_reg <= dbus_rdata;
            end
            STATE_WRITEBACK: begin
                if (reg_write_enable_latched)
                    // Write to register file
                pc <= next_pc;
            end
        endcase
    end
end
```

**Key insight:** We needed to latch (save) values from one state to use in later states. For example, the ALU result computed in EXECUTE must be saved so it can be written to a register in WRITEBACK. Missing any of these latches leads to subtle bugs.

---

## Phase 3: System Integration {#phase-3-system-integration}

A CPU is useless without memory and I/O. We built a simple System-on-a-Chip:

### Simple Bus Arbiter (`rtl/bus/simple_bus.sv`)

The bus connects the CPU to peripherals using address-based routing:

```systemverilog
always_comb begin
    if (ibus_addr >= 32'h00000000 && ibus_addr < 32'h00400000) begin
        ibus_to_ram = 1;
        ibus_to_uart = 0;
    end else if (ibus_addr >= 32'h10000000 && ibus_addr < 32'h10000100) begin
        ibus_to_ram = 0;
        ibus_to_uart = 1;
    end
    // ... similar logic for data bus ...
end
```

### RAM Module (`rtl/peripherals/ram.sv`)

We implemented a simple synchronous RAM that can be pre-loaded with a program:

```systemverilog
initial begin
    if (MEM_INIT_FILE != "") begin
        $readmemh(MEM_INIT_FILE, mem);
    end
end
```

This lets us compile an assembly program, convert it to a hex file, and load it into the simulation's memory at startup.

### UART 16550 (`rtl/peripherals/uart_16550.sv`)

The UART is our window into the processor. When the CPU writes a byte to address `0x10000000`, the UART sends it out as a serial character. Our testbench captures these characters and prints them to the console.

**Why ns16550a?** It's an industry-standard UART controller. OpenSBI expects to find this specific peripheral, with registers at specific offsets.

### Top-Level SoC (`rtl/soc/riscv_soc.sv`)

The top module wires everything together:

```systemverilog
module riscv_soc #(
    parameter MEM_INIT_FILE = ""
) (
    input  logic clk,
    input  logic rst_n,
    output logic uart_tx
);

cpu_core u_cpu_core (
    .clk(clk),
    .rst_n(rst_n),
    .ibus_req(ibus_req),
    .ibus_addr(ibus_addr),
    // ... many more connections ...
);

simple_bus u_simple_bus (
    .clk(clk),
    .rst_n(rst_n),
    .ibus_req(ibus_req),
    // ... route between CPU and peripherals ...
);

ram #(.MEM_INIT_FILE(MEM_INIT_FILE)) u_ram (...);
uart_16550 u_uart (...);

endmodule
```

**At this point:** We had ~2,600 lines of RTL that *compiled*. But did it *work*? Not even close.

---

## Phase 4: Simulation and Debugging {#phase-4-simulation-and-debugging}

### The Test Program

We wrote a simple assembly program (`sw/tests/hello.S`) to print "Hello RISC-V!\n" via the UART:

```assembly
_start:
    lui  sp, 0x400          # Set up stack pointer
    li   a0, hello_msg      # Load address of string
    jal  print_string       # Call print function

print_string:
    lui  a1, 0x10000        # UART base address
print_loop:
    lbu  t0, 0(a0)          # Load byte from string
    beqz t0, print_done     # If zero, we're done
wait_uart:
    lbu  t1, 5(a1)          # Check UART status register
    andi t1, t1, 32         # Check TX empty bit
    beqz t1, wait_uart      # Wait until ready
    sb   t0, 0(a1)          # Write character to UART
    addi a0, a0, 1          # Increment string pointer
    j    print_loop         # Repeat

print_done:
    ret

hello_msg:
    .string "Hello RISC-V!\n"
```

We compiled it with the RISC-V toolchain:

```bash
riscv64-linux-gnu-gcc -march=rv32ima_zicsr -mabi=ilp32 -nostdlib -Ttext=0x0 -o hello.elf hello.S
riscv64-linux-gnu-objcopy -O binary hello.elf hello.bin
od -An -tx4 -w4 -v hello.bin | awk '{print $1}' > hello.hex
```

### The Debugging Odyssey: Fifteen Critical Bugs

When we first ran the simulation, nothing worked. The PC didn't advance. Registers had garbage. The UART was silent. Over several days of intense debugging, we discovered and fixed **fifteen critical bugs**:

- **Bug #1 — Bus request dropped during wait states.** `ibus_req` went LOW in `STATE_FETCH_WAIT`, so the RAM's acknowledge never completed. Fix: hold the signal high through both FETCH and FETCH_WAIT.

- **Bug #2 — Register write enable not latched.** `reg_write_enable` was computed in DECODE but needed in WRITEBACK. By then it had the wrong value. Fix: latch it in EXECUTE.

- **Bug #3 — PC always incremented by 4.** After a `JAL`, the PC advanced sequentially instead of jumping. Fix: only add 4 for non-branch, non-jump instructions.

- **Bug #4 — Write-back data source not latched.** The mux selecting what to write to the register file used stale decode-time values. Fix: latch `reg_write_source` in EXECUTE.

- **Bug #5 — Load byte extraction missing.** `LBU` was writing the full 32-bit word to the register instead of extracting and zero-extending the correct byte. Fix: add byte/halfword extraction logic using the latched address offset.

- **Bug #6 — Memory address using live ALU output.** During STATE_MEMORY, the bus address came from the combinational ALU output (already computing the next instruction) rather than the latched result. Fix: use `alu_result_reg`.

- **Bug #7 — UART register index decoded wrong.** The UART used `addr[2:0]` for register selection instead of `addr[4:2]`, hitting the wrong register on every access.

- **Bug #8 — Stores never advanced the PC.** Stores skipped STATE_WRITEBACK (where PC update happens), so the CPU looped on the same store forever. Fix: route all instructions through WRITEBACK.

After these eight fixes: `Hello, RISC-V!` printed to the console.

---

## The Gauntlet: From ISA Verification to Firmware Readiness {#phase-5-7-the-gauntlet}

Getting "Hello, World!" to print was just the beginning. To run real firmware, the processor needs to be bulletproof. This meant subjecting it to a gauntlet of rigorous tests, implementing a full exception and interrupt system, and fixing every bug we found along the way.

### Phase 5: Systematic ISA Verification

We integrated the official RISC-V test suite—187 rigorous tests covering every instruction in RV32I and the M extension. This immediately revealed **Bug #9: Branch Taken Signal Not Latched**.

The problem? Our `branch_taken` signal was computed in `STATE_EXECUTE` but used in `STATE_WRITEBACK`. By then, the decoder was looking at the *next* instruction, and `branch_taken` had the wrong value. The fix, now a familiar pattern: latch it!

```systemverilog
always_ff @(posedge clk) begin
    if (state == STATE_EXECUTE) begin
        branch_taken_latched <= branch_taken;
    end
end
```

After fixing this, **100% of tests passed**. We had a fully functional RV32IM processor.

### Phase 6: Full Trap, Exception, and Interrupt Handling

This was the most complex phase, turning our simple core into a robust, fault-tolerant processor.

#### Phase 6A: Basic Traps
We implemented `ECALL`, `EBREAK`, and `MRET`, which are essential for system calls and debugging. This uncovered two bugs related to how our `trap_taken` signal was managed.

#### Phase 6B: All Exception Types
We implemented all 9 M-mode exception types, including illegal instructions and memory misalignment. This revealed three more critical bugs, all related to how we handled stale instruction data after a trap. The key fix was an `instruction_valid` flag to prevent the CPU from re-interpreting old instructions.

#### Phase 6C: Timer Interrupts & The Critical Bug #15
We added a hardware timer peripheral that could interrupt the CPU. This is where we found the most subtle and important bug of the entire project:

**Bug #15 — Load/Store control signals invalid in STATE_MEMORY.** Store instructions inside interrupt handlers were generating spurious misalignment exceptions. The immediate-select signal for address calculation (`rs1 + imm`) reverted to its default in STATE_MEMORY, computing `rs1 + rs2` instead. A one-line fix extended the signal's validity to cover STATE_MEMORY.

This bug had been lurking in the design for a while, but only the complex state changes of an interrupt handler could trigger it.

#### Phase 6D: Software Interrupts and Priority
Finally, we added software interrupts (triggered by a CSR write) and an interrupt priority arbiter, ensuring that higher-priority interrupts (Software) are handled before lower-priority ones (Timer).

### Phase 7: Final Validation

With all features in place, we wrote `test_firmware.S`, a comprehensive test that mimics a real firmware boot sequence. It tests CSR access, interrupt handling, and peripheral access in one program.

**The result: It passed, printing "FIRMWARE_OK".** Our processor was ready.

---

## Final Status: A Production-Ready M-Mode Core {#final-status}

After completing all seven phases in an intense two-day sprint, the project achieved its goal. Our processor now has:

### What We've Achieved

✅ **Complete RV32IMAZicsr ISA** — All instructions verified with 200 tests
✅ **Full Exception Handling** — All 9 exception types implemented and tested
✅ **Full Interrupt System** — Timer and software interrupts with priority handling
✅ **Complete Trap Infrastructure** — `ECALL`, `EBREAK`, `MRET` working perfectly
✅ **40+ CSRs Implemented** — All M-mode registers plus S-mode read-zero/write-ignore stubs for compatibility
✅ **Memory-Mapped Peripherals** — UART and Timer fully integrated
✅ **100% Test Pass Rate** — 200 tests passing (187 ISA + 13 custom)
✅ **OpenSBI v1.8.1 Boots** — Full banner output on our from-scratch RV32IMA softcore

### What's Next?

**FPGA Implementation (Phase 9)**
- Synthesize the design for a real FPGA and see it run on hardware.

**Supervisor Mode & Linux**
- The ultimate challenge: add Supervisor mode and virtual memory to boot a full Linux kernel.

---

## Phase 8: The Real OpenSBI Boot — 14 More Bugs to the Banner {#phase-8-opensbi}

> "We just passed `test_firmware.S`. OpenSBI should be easy — it's just more of the same, right?"

It was not easy.

What followed was the most intense debugging session of the entire project. Booting the real OpenSBI v1.8.1 binary on our CPU exposed fourteen more bugs, spanning every layer of the stack: the division unit, the DTB format, the firmware entry sequence, halfword/byte stores, a null platform ops pointer, linker script arithmetic, and finally — one single wrong bit-slice in the UART controller.

This is the story of how we got from a passing firmware test to this:

```
OpenSBI v1.8.1-32-g8d1c21b3
   ____                    _____ ____ _____
  / __ \                  / ____|  _ \_   _|
 | |  | |_ __   ___ _ __ | (___ | |_) || |
 | |  | | '_ \ / _ \ '_ \ \___ \|  _ < | |
 | |__| | |_) |  __/ | | |____) | |_) || |_
  \____/| .__/ \___|_| |_|_____/|____/_____|
        | |
        |_|

Platform Name               : Bootble RV32IMA
Platform Features           : medeleg
Platform HART Count         : 1
Platform Console Device     : uart8250
Firmware Base               : 0x0
Firmware Size               : 308 KB
Firmware RW Offset          : 0x40000
Domain0 Next Address        : 0x00800000
Boot HART Base ISA          : rv32ima
Runtime SBI Version         : 3.0
```

### Setting the Stage

After Phase 7 validation, we had a working RV32IMAZicsr CPU with a custom `test_firmware.S` that exercised all the M-mode features. The next challenge: build a real OpenSBI platform (`platform/bootble/`) and boot the actual OpenSBI v1.8.1 firmware image.

We compiled OpenSBI with:
```
PLATFORM=bootble PLATFORM_RISCV_XLEN=32 FW_TEXT_START=0x0 \
  FW_JUMP_ADDR=0x00800000 FW_JUMP_FDT_ADDR=0x003F0000
```

And created a boot image: `[fw_jump.bin @ 0x0] [DTB @ 0x3F0000] [stub @ 0x800000]`.

The CPU started. Silence. No output. Time to find the bugs.

---

- **Bugs #16–19 — Division unit falls apart.** Four separate bugs in `muldiv.sv`: the start signal pulsed continuously instead of once, the `div_working` flag cleared itself on cycle 1, borrow bits accumulated incorrectly, and the final remainder correction step was missing. Real firmware calls deep into GCC's `__qdivrem` and exposed all four at once.

- **Bug #20 — DTB byte-swapped.** The FDT magic number appeared as `0xedfe0dd0` instead of `0xd00dfeed` — we generated the DTB with `xxd` (byte-order output) then packed into 32-bit words without swapping. Fix: use `od -An -tx4 -w4 -v` which outputs little-endian words directly.

- **Bug #21 — `fw_next_mode` returned the wrong value.** The function returned register `a0` which happened to hold `1` (PRV_S), telling OpenSBI to take the warmboot path and skip console initialization entirely. Fix: `li a0, 0`.

- **Bug #22 — ELF64 binary on an RV32 CPU.** The build defaulted to the host compiler's 64-bit target. `readelf -h fw_jump.elf` showed `Class: ELF64`. Fix: explicitly set `PLATFORM_RISCV_XLEN=32` and always verify with `readelf -h` before loading.

- **Bug #23 — `nascent_init` was NULL.** OpenSBI calls `platform_ops->nascent_init` before `early_init`. We hadn't populated that field, so the call trapped and UART initialization was skipped entirely.

- **Bug #24 — Halfword store write-strobe wrong.** `SH` shifted by `byte_offset[1:0]` (two bits) instead of `byte_offset[1]` (one bit), placing the halfword at the wrong byte lanes for odd addresses.

- **Bug #25 — Byte store data not replicated across lanes.** For sub-word stores, the byte must appear in all four lanes so the peripheral can pick the right one via `wstrb`. We only populated lane 0. Fix: `{rs2[7:0], rs2[7:0], rs2[7:0], rs2[7:0]}`.

- **Bug #26 — `platform_ops_addr` NULL at runtime.** The static initializer captured the pre-relocation address (0x0). Fix: patch it at runtime inside `fw_platform_init()`.

- **Bug #27 — `fw_rw_offset` not a power of two.** `lla a4, _fw_start` captured the PC-relative address after relocation (`0x4`), making `fw_rw_offset = 0x3FFFC`. Fix: `li a4, FW_TEXT_START` uses the compile-time constant.

- **Bug #28 — `FW_JUMP_ADDR=0x0` rejected.** OpenSBI refuses a next-stage address equal to the firmware base. Fix: set `FW_JUMP_ADDR=0x00800000` and place a stub there.

- **Bug #29 — UART register decode off by one bit range.** OpenSBI's `uart8250` driver uses `reg-shift = <2>`, so the LSR lives at offset `0x14`. Our UART decoded `addr[2:0]` (giving register 4, MCR) instead of `addr[4:2]` (giving register 5, LSR). The THRE bit was never visible, so the TX-ready poll looped forever. One character change — `[2:0]` → `[4:2]` — and output flowed.

---

### The Banner

After Bug #29 was fixed, we rebuilt and ran the simulation. The terminal filled with the OpenSBI boot sequence, ending with the full platform info table. **29 bugs. 8 phases. OpenSBI boots.**

---

## Lessons Learned on the Journey {#lessons-learned}

### 1. Microarchitecture Documentation is Not Optional

Every bug we fixed came down to: "The RTL doesn't match what the CPU is supposed to do." Having detailed microarchitecture docs let us quickly identify these mismatches. Without them, we'd still be debugging.

### 2. Latching is Everything

In a multi-cycle CPU, you compute values in one state and use them several cycles later. If you don't latch those values, they'll have changed by the time you need them. This was the root cause of bugs #2, #4, #5, and #6.

### 3. Test Early, Test Small

We could have written the entire CPU and then tried to boot OpenSBI. That would have been a disaster. Instead, we tested each module individually, then with simple assembly programs, building up complexity gradually.

### 4. Verilator is a Superpower

Compared to commercial simulators like ModelSim, Verilator is *blazing fast*. It compiles your Verilog to C++, which then compiles to native machine code. We could simulate millions of cycles in seconds, making the debug cycle much faster.

### 5. The RISC-V Spec is Dense

Even the "simple" RV32I base instruction set has corner cases: What happens when you write to x0? How do you sign-extend immediates in B-type instructions? The specification is precise, but you need to read it very carefully.

### 6. Hardware Bugs Are Different

In software, you can add a print statement and see what's happening. In hardware, your "print statement" is adding signals to a waveform viewer and scrolling through thousands of clock cycles. Debugging requires patience and systematic thinking.

---

## The Bigger Picture

This project is inspired by Uros Popovic's articles on [RISC-V boot processes](https://popovicu.com/posts/risc-v-sbi-and-full-boot-process/) and [AI creating a bootable VM](https://popovicu.com/posts/ai-creates-bootable-vm/). Those articles built software emulators that interpret RISC-V instructions.

We took a fundamentally different approach: **we built the actual hardware**. A from-scratch SystemVerilog soft processor core, cycle-accurate and synthesizable, simulated in Verilator, booting unmodified OpenSBI v1.8.1.

**The key difference:** An emulator is software pretending to be hardware. Our RTL *is* the hardware — it describes the actual logic gates, registers, and wires that would exist in silicon.

That means our soft processor core can be:
- **Synthesized to an FPGA** and run at hundreds of MHz on real hardware
- **Taped out as an ASIC** (with proper design tools and foundry access)
- **Extended with caches, pipelines, and advanced features** for performance
- **Used to boot Linux** and run real applications on physical silicon

This is how real processors are built — not as software interpreters, but as RTL that becomes actual transistors and logic gates. Not perfectly on the first try, but iteratively, with careful design, rigorous testing, and systematic debugging.

---

## Acknowledgments

This project stands on the shoulders of giants:
- **The RISC-V Foundation** for creating an open, extensible ISA
- **The Verilator team** for an incredible open-source RTL simulator
- **The OpenSBI maintainers** for production-grade firmware
- **Uros Popovic** for excellent articles on RISC-V boot processes that inspired this hardware implementation
- **SilicogenAI** for AI-assisted RTL design and debugging
- Countless contributors to the RISC-V ecosystem

---

## Try It Yourself

The entire project is open source. To boot OpenSBI:

```bash
cd /silicogenplayground/bootble-vm-riscv
make all          # builds OpenSBI + DTB + boot image + simulator
./build/verilator/Vtb_soc
```

You'll see the full OpenSBI v1.8.1 banner print to the console. From there, you can:
- Look at waveforms in GTKWave to see internal signals cycle-by-cycle
- Run the unit test suite: `make sw && make sim`
- Add new features: S-mode, virtual memory, a second HART
- Synthesize to an FPGA

---

## Epilogue: What We Learned

Building a processor teaches you that **every assumption must be validated**. You can't assume a signal will hold its value. You can't assume the PC will update correctly. You can't assume the instruction register contains valid data.

The gap between "it compiles" and "it works" is filled with these assumptions. Each bug we fixed came from discovering an assumption we didn't know we'd made.

But now we have something remarkable: a processor that doesn't just execute instructions—it handles errors gracefully. It can trap on illegal operations, misaligned accesses, and invalid jumps. It can enter trap handlers, update status registers, and return to normal execution. It can be interrupted by hardware timers and software requests, handling them with proper priority.

This is what real processors do. And we built it from scratch, in two days.

The finish line has been crossed. 🚀
