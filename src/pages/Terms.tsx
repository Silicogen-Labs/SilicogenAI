import SubNavbar from "@/components/landing/SubNavbar";
import Footer from "@/components/landing/Footer";

const Terms = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SubNavbar />
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-28">
      <h1 className="mb-2 text-4xl font-black tracking-tight">Terms of Service</h1>
      <p className="mb-10 text-sm text-muted-foreground">Last updated: February 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using Silicogen's services, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">2. Use of Services</h2>
          <p>You agree to use our services only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account credentials.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">3. Intellectual Property</h2>
          <p>All content, code, and materials generated through the platform remain subject to Silicogen's intellectual property rights unless otherwise agreed in writing.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">4. Limitation of Liability</h2>
          <p>Silicogen shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">5. Contact</h2>
          <p>For questions about these terms, contact us at silicogenlabs@gmail.com.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
