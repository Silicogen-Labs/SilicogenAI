import SubNavbar from "@/components/landing/SubNavbar";
import Footer from "@/components/landing/Footer";

const Cookies = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SubNavbar />
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-28">
      <h1 className="mb-2 text-4xl font-black tracking-tight">Cookie Policy</h1>
      <p className="mb-10 text-sm text-muted-foreground">Last updated: February 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience by remembering your preferences and usage patterns.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">2. How We Use Cookies</h2>
          <p>We use essential cookies for site functionality, analytics cookies to understand usage, and preference cookies to remember your settings such as theme selection.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">3. Managing Cookies</h2>
          <p>You can control cookies through your browser settings. Disabling certain cookies may affect site functionality.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">4. Contact</h2>
          <p>For questions about our cookie practices, contact us at silicogenlabs@gmail.com.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default Cookies;
