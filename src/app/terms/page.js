import Link from "next/link";

export const metadata = {
  title: "Terms of Service | AutoDM",
  description: "Terms and conditions of service for using the AutoDM Integration platform.",
};

export default function TermsOfServicePage() {
  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "var(--font-body), sans-serif", color: "var(--text-primary)" }}>
      
      {/* Premium Header Banner */}
      <header style={{ 
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", 
        color: "white", 
        padding: "4rem 1.5rem 5rem", 
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
      }}>
        {/* Glow effects */}
        <div style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />
        
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ 
            color: "#38bdf8", 
            textDecoration: "none", 
            fontWeight: 600, 
            fontSize: "0.875rem", 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            marginBottom: "1.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "999px",
            transition: "all 0.2s ease"
          }}>
            ← Back to Home
          </Link>
          <h1 style={{ 
            fontFamily: "var(--font-heading)", 
            fontSize: "2.75rem", 
            fontWeight: 800, 
            letterSpacing: "-0.03em", 
            lineHeight: 1.2,
            marginBottom: "1rem",
            color: "white"
          }}>
            Terms of Service
          </h1>
          <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem", lineHeight: "1.6" }}>
            Please read these terms carefully before using the AutoDM automation platform. By using the app, you agree to these terms.
          </p>
          <span style={{ 
            display: "inline-block", 
            marginTop: "1.25rem", 
            fontSize: "0.85rem", 
            color: "#38bdf8", 
            backgroundColor: "rgba(56, 189, 248, 0.08)", 
            padding: "0.25rem 0.75rem", 
            borderRadius: "6px",
            fontWeight: "600"
          }}>
            Last Updated: May 26, 2026
          </span>
        </div>
      </header>

      {/* Split Layout Container */}
      <main style={{ maxWidth: "1100px", margin: "-2.5rem auto 5rem", padding: "0 1.5rem", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2.5rem", alignItems: "start" }} className="privacy-grid-layout">
          
          {/* Left Column: Sticky Sidebar Table of Contents */}
          <aside className="privacy-sidebar" style={{ 
            position: "sticky", 
            top: "100px", 
            backgroundColor: "white", 
            borderRadius: "16px", 
            border: "1px solid var(--border-light)", 
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)"
          }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
              Sections
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a href="#acceptance" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">1. Acceptance of Terms</a>
              <a href="#eligibility" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">2. Eligibility & Accounts</a>
              <a href="#use-license" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">3. Platform Use License</a>
              <a href="#meta-policies" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">4. Meta Policies & DMs</a>
              <a href="#termination" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">5. Account Termination</a>
              <a href="#disclaimers" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">6. Disclaimers & Limits</a>
              <a href="#contact" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">7. Support Contact</a>
            </nav>
          </aside>

          {/* Right Column: Terms Document */}
          <article className="privacy-article" style={{ 
            backgroundColor: "white", 
            borderRadius: "16px", 
            border: "1px solid var(--border-light)", 
            padding: "3rem 2.5rem",
            boxShadow: "var(--shadow-md)",
            lineHeight: "1.75"
          }}>
            
            <section id="acceptance" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                1. Acceptance of Terms
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem" }}>
                By creating an account, linking Facebook/Instagram pages, or utilizing any services provided by <strong>AutoDM</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using our services.
              </p>
            </section>

            <section id="eligibility" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                2. Eligibility & Account Security
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem", marginBottom: "0.75rem" }}>
                To use our platform, you must meet the following eligibility criteria:
              </p>
              <ul style={{ paddingLeft: "1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>You must be at least 18 years old or the legal age of majority in your jurisdiction.</li>
                <li>You must possess an active Facebook account connected to a valid Instagram Business/Creator Account.</li>
                <li>You are solely responsible for maintaining the confidentiality of your credentials and account access.</li>
                <li>You must notify us immediately of any unauthorized use or security breaches regarding your account.</li>
              </ul>
            </section>

            <section id="use-license" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                3. Platform Use License & Restrictions
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem", marginBottom: "0.75rem" }}>
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use AutoDM strictly for your personal or commercial business messaging purposes. Under this license, you agree NOT to:
              </p>
              <ul style={{ paddingLeft: "1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>Use the automation rules to send spam, bulk promotional links, or abusive messages to Instagram/Facebook users.</li>
                <li>Attempt to reverse-engineer, decompile, or hack any portion of our codebase or API connectors.</li>
                <li>Use the app to distribute malware, phishing links, or any illegal content.</li>
                <li>Violate any local, national, or international laws or regulations during your usage of the platform.</li>
              </ul>
            </section>

            <section id="meta-policies" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                4. Meta Platform Policies & Chat Data
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem" }}>
                AutoDM works via official Meta APIs (Facebook Graph API and Instagram Messaging API). Your usage of AutoDM must comply with Meta's developer terms. If your Meta account or connected pages are suspended by Meta for violating their terms (e.g., sending prohibited contents, bulk message abuse), AutoDM is not responsible for any disruptions, page blocks, or data losses that result.
              </p>
            </section>

            <section id="termination" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                5. Account Termination
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem" }}>
                We reserve the right, without notice or liability, to suspend or terminate your access to the platform if you breach these terms. You can close your account and delete your stored keys or logs at any time via the dashboard disconnect settings or by submitting a request on our <Link href="/data-deletion" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>Data Deletion Page</Link>.
              </p>
            </section>

            <section id="disclaimers" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                6. Disclaimers & Limitation of Liability
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem" }}>
                AutoDM is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We make no warranties, expressed or implied, regarding uptime, accuracy, or suitability of automated direct message routing. In no event shall AutoDM, its developers, or parent team (Zrubix) be liable for any direct, indirect, incidental, or consequential damages (including loss of business, data, or reputation) arising out of the use or inability to use our platform.
              </p>
            </section>

            <section id="contact" style={{ scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                7. Contact Support & Inquiries
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem", marginBottom: "1.5rem" }}>
                For questions, support tickets, or concerns about these Terms of Service, reach out to our team:
              </p>
              <div style={{
                backgroundColor: "var(--bg-page)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "600", margin: "0 0 0.25rem 0" }}>Zrubix Support Desk</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Average response time: &lt; 24 Hours</p>
                </div>
                <a href="mailto:support@zrubix.com" className="btn btn-primary btn-sm">
                  Send Email
                </a>
              </div>
            </section>

          </article>

        </div>
      </main>
    </div>
  );
}
