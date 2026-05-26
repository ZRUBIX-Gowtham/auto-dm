import Link from "next/link";
import DataDeletionForm from "@/components/DataDeletionForm";

export const metadata = {
  title: "Data Deletion & Privacy Controls | AutoDM",
  description: "Request data deletion, disconnect page access tokens, or revoke Facebook Business Integrations in the AutoDM SaaS Platform.",
};

export default function DataDeletionPage() {
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
          right: "-50px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-150px",
          left: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)",
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
            Data Deletion Instructions
          </h1>
          <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem", lineHeight: "1.6" }}>
            At AutoDM, we value your privacy. Learn how to disconnect your channels, revoke Meta app integration permissions, or request permanent deletion of your account logs.
          </p>
        </div>
      </header>

      {/* Main Grid Content */}
      <main style={{ maxWidth: "1100px", margin: "-2.5rem auto 4rem", padding: "0 1.5rem", position: "relative", zIndex: 2 }}>
        <div className="deletion-grid-layout" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem", alignItems: "start" }}>

          {/* Left Column: Info & Manual steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Intro Alert Box */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid var(--border-light)",
              padding: "2rem",
              boxShadow: "var(--shadow-sm)"
            }}>
              <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: "1.7", margin: 0 }}>
                As an authorized integration platform utilizing official Meta APIs, <strong>AutoDM</strong> guarantees that you maintain absolute control over the permissions and information you share. Below are the three compliant pathways to handle your data.
              </p>
            </div>

            {/* Method 1 Card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid var(--border-light)",
              padding: "2rem",
              boxShadow: "var(--shadow-sm)",
              transition: "transform 0.2s ease"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                  color: "var(--color-primary)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: "700"
                }}>1</div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                  Disconnect Channels via Dashboard
                </h2>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1rem", lineHeight: "1.6" }}>
                This is the fastest method to stop integrations for individual pages or Instagram Business accounts instantly.
              </p>
              <ol style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "1rem" }}>
                <li>Log in to your account at <Link href="/login" style={{ color: "var(--color-primary)", fontWeight: "600", textDecoration: "underline" }}>AutoDM Dashboard</Link>.</li>
                <li>Navigate to the <strong>Connected Accounts</strong> configuration tab.</li>
                <li>Find the target Instagram handle or Facebook page you wish to unlink.</li>
                <li>Click the red <strong>Disconnect</strong> button to confirm token deletion.</li>
              </ol>
              <div style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                fontSize: "0.85rem",
                color: "#991b1b",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center"
              }}>
                <strong>ℹ️ Notice:</strong> Disconnecting immediately wipes all page access tokens and disables API triggers.
              </div>
            </div>

            {/* Method 2 Card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid var(--border-light)",
              padding: "2rem",
              boxShadow: "var(--shadow-sm)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                  color: "var(--color-primary)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: "700"
                }}>2</div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                  Revoke via Facebook Business Settings
                </h2>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.25rem", lineHeight: "1.6" }}>
                You can revoke access directly from your own Meta account settings. Meta will notify our endpoints to clean up.
              </p>
              <ol style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "1.25rem" }}>
                <li>Go to your Facebook settings tab: <a href="https://www.facebook.com/settings?tab=business_tools" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", fontWeight: "600", textDecoration: "underline" }}>Facebook Business Integrations</a>.</li>
                <li>Locate the <strong>AutoDM Integration</strong> app card in the active list.</li>
                <li>Check the select box next to it and click the <strong>Remove</strong> button.</li>
                <li>Verify and approve the prompt. This will sever all app permissions instantly.</li>
              </ol>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Interactive Form Card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid var(--border-light)",
              padding: "2rem",
              boxShadow: "var(--shadow-md)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div style={{
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  color: "#ef4444",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: "700"
                }}>3</div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                  Request Permanent Account Purge
                </h2>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
                To wipe out your entire account profile, keyword logs, automation statistics, and message history database records forever, fill out the form below.
              </p>

              {/* Embed DataDeletionForm Client Component */}
              <DataDeletionForm />
            </div>

            {/* Need Help footer card */}
            <div style={{
              backgroundColor: "rgba(37, 99, 235, 0.02)",
              borderRadius: "16px",
              border: "1px dashed var(--border-light)",
              padding: "1.5rem",
              textAlign: "center"
            }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                Need manual assistance or have questions? Email us directly at{" "}
                <a href="mailto:support@zrubix.com" style={{ color: "var(--color-primary)", fontWeight: "600", textDecoration: "underline" }}>
                  support@zrubix.com
                </a>
              </p>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
