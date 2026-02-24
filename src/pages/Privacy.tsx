import SubNavbar from "@/components/landing/SubNavbar";
import Footer from "@/components/landing/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SubNavbar />
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-28">
      <h1 className="mb-2 text-4xl font-black tracking-tight">Privacy Policy</h1>
      <p className="mb-10 text-sm text-muted-foreground">Last updated: February 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">1. Information We Collect</h2>
          <p>We collect minimal information you provide directly, such as your name and email address when you sign up for our waitlist or contact us. We also collect basic usage data automatically, including IP addresses, browser type, and interaction patterns to improve our services.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">2. What We Do NOT Collect</h2>
          <p>We do <strong className="text-foreground">not</strong> collect, access, store, or analyze your codebase, source code, repositories, wiki content, private data, or any proprietary information. Your intellectual property remains entirely yours. Silicogen never accesses your private projects, files, or development environments.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">3. How We Use Your Information</h2>
          <p>Your information is used solely to provide and improve our services, communicate with you, and ensure platform security. We do not sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data. However, no method of electronic transmission or storage is 100% secure.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">5. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us at silicogenlabs@gmail.com.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">6. Contact</h2>
          <p>For questions about this policy, contact us at silicogenlabs@gmail.com.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
