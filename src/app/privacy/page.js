import Link from "next/link";

export const metadata = {
  title: "Privacy Policy & GDPR Compliance | AutoDM",
  description: "Privacy policy, data collection terms, and usage guidelines for the AutoDM Integration platform.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem", lineHeight: "1.6" }}>
            Learn how we collect, process, encrypt, and secure your information in compliance with Meta Developer Policies and global data guidelines.
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
              <a href="#introduction" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">1. Introduction</a>
              <a href="#collection" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">2. Data We Collect</a>
              <a href="#usage" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">3. How We Use It</a>
              <a href="#security" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">4. Security Measures</a>
              <a href="#deletion" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">5. Data Deletion</a>
              <a href="#compliance" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">6. Meta Compliance</a>
              <a href="#contact" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }} className="toc-link">7. Contact Support</a>
            </nav>
          </aside>

          {/* Right Column: Policy Document */}
          <article
            className="privacy-article"
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid var(--border-light)",
              padding: "3rem 2.5rem",
              boxShadow: "var(--shadow-md)",
              lineHeight: "1.75"
            }}
          >

            <section id="introduction" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                1. Introduction
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem" }}>
                Welcome to <strong>AutoDM</strong>. We are fully committed to protecting your personal data, privacy, and integrity. This document sets out how we handle your accounts and logs when you connect your Instagram and Facebook platforms to our message automation software. We abide strictly by regional data security frameworks and standard Meta API restrictions.
              </p>
            </section>

            <section id="collection" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                2. Data We Collect
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem", marginBottom: "0.75rem" }}>
                To establish automated responses for your accounts, we gather and store metadata authorized via Facebook Login:
              </p>
              <ul style={{ paddingLeft: "1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li><strong>Meta Profile Details:</strong> Your public name, registered email address, avatar icon, and account user ID keys.</li>
                <li><strong>Associated Page Metadata:</strong> Target names, account IDs, and user configurations of your associated Facebook Pages or Instagram Business profiles.</li>
                <li><strong>Authentication Tokens:</strong> Securely encrypted Page Access Tokens generated by Facebook Graph APIs to trigger automated messaging actions on your behalf.</li>
                <li><strong>Webhook Message Events:</strong> Incoming text, trigger status, sender username handles, and timestamps to evaluate keyword automation triggers.</li>
              </ul>
            </section>

            <section id="usage" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                3. How We Use Your Information
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem", marginBottom: "0.75rem" }}>
                We utilize your shared tokens and messages under strict operational scopes:
              </p>
              <ul style={{ paddingLeft: "1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>To bind your selected inboxes to the central AutoDM automation dashboard.</li>
                <li>To listen to incoming chat messages and match them to user-defined keyword configurations.</li>
                <li>To transmit the exact replies you set up to the respective sender.</li>
                <li>To update the metric logs page in your SaaS panel showing click-through counters and logs.</li>
              </ul>
            </section>

            <section id="security" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                4. Data Protection and Security
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem" }}>
                Security is paramount. We deploy our database over Firestore using structured rules so only you can access your keys and automation parameters. API and webhook communications are guarded through SSL transport, and signature headers are verified using custom tokens. We do not sell, rent, or lease your page logs to third-party databases.
              </p>
            </section>

            <section id="deletion" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                5. Data Deletion
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem", marginBottom: "1rem" }}>
                You maintain total authority over your records. Disconnecting accounts on the dashboard instantly purges all Facebook or Instagram access keys from our cloud storage.
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem" }}>
                To completely wipe all personal records, rules, trigger metrics, and settings permanently, visit our interactive{" "}
                <Link href="/data-deletion" style={{ color: "var(--color-primary)", fontWeight: "600", textDecoration: "underline" }}>
                  Data Deletion Instructions Page
                </Link>{" "}
                and submit a formal deletion request.
              </p>
            </section>

            <section id="compliance" style={{ marginBottom: "2.5rem", scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                6. Meta Developer Policy Compliance
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem" }}>
                In compliance with the Meta Platform Terms and Developer Policies: We implement secure mechanisms for callbacks, support instant revocation, provide this clear privacy policy, and operate within the requested permissions boundaries. We do not store or request access to your password credentials.
              </p>
            </section>

            <section id="contact" style={{ scrollMarginTop: "120px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                7. Contact Support
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.975rem", marginBottom: "1.5rem" }}>
                If you have queries, doubts, or require assistance on our privacy policies, feel free to contact us:
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
