"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/components/AuthProvider";
import { updateProfile } from "firebase/auth";
import { auth, isSimulationMode } from "@/firebase/config";
import { 
  FiUser, 
  FiSliders, 
  FiBookOpen, 
  FiEdit, 
  FiCheckCircle, 
  FiCpu, 
  FiArrowRight, 
  FiFileText 
} from "react-icons/fi";

export default function SettingsPage() {
  const { user } = useAuth();
  
  // Tabs
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form States
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName) return;

    setLoading(true);
    setSuccessMsg("");
    try {
      if (isSimulationMode) {
        // Mock profile update
        const mockUser = JSON.parse(localStorage.getItem("insta_auto_dm_mock_user"));
        mockUser.displayName = displayName;
        mockUser.photoURL = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`;
        localStorage.setItem("insta_auto_dm_mock_user", JSON.stringify(mockUser));
        setSuccessMsg("Profile updated successfully (Simulated)!");
      } else {
        // Real Firebase Auth
        await updateProfile(auth.currentUser, {
          displayName: displayName,
          photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`
        });
        setSuccessMsg("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Settings</h1>
          <p className="page-subtitle">Configure your profile, view guides, and manage application configurations</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "2.5rem", alignItems: "start" }}>
        
        {/* Navigation Tabs (Vertical Sidebar List) */}
        <div className="card" style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <button 
            className={`sidebar-link ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            style={{ border: "none", background: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
          >
            <FiUser /> Profile Settings
          </button>
          <button 
            className={`sidebar-link ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
            style={{ border: "none", background: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
          >
            <FiSliders /> Preferences
          </button>
          <button 
            className={`sidebar-link ${activeTab === "meta-guide" ? "active" : ""}`}
            onClick={() => setActiveTab("meta-guide")}
            style={{ border: "none", background: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
          >
            <FiBookOpen /> Meta API Guide
          </button>
        </div>

        {/* Settings Content Panels */}
        <div className="card">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>Profile Information</h3>
              
              {successMsg && (
                <div className="badge badge-success" style={{ width: "100%", padding: "0.75rem", textTransform: "none", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", borderRadius: "var(--radius-sm)", fontWeight: 500 }}>
                  <FiCheckCircle size={18} />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} style={{ maxWidth: "500px" }}>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label className="form-label">Email Address (Read-only)</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user?.email || ""}
                    style={{ backgroundColor: "var(--bg-page)", cursor: "not-allowed" }}
                    disabled
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "2rem" }}>
                  <label className="form-label">Display Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ height: "44px" }} disabled={loading}>
                  {loading ? "Saving..." : <><FiEdit /> Update Display Name</>}
                </button>
              </form>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === "preferences" && (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>Preferences & Themes</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Active Theme</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                    Configure the theme look and feel of your AutoDM platform workspace.
                  </p>
                  
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ border: "2px solid var(--color-primary)", borderRadius: "var(--radius-md)", padding: "1rem", flexGrow: 1, cursor: "default", background: "white" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600 }}>SaaS Premium White</span>
                        <span className="badge badge-primary">ACTIVE</span>
                      </div>
                      <div style={{ height: "12px", width: "100%", background: "#f1f5f9", borderRadius: "2px", marginTop: "1rem" }}></div>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <div style={{ height: "8px", width: "40%", background: "#cbd5e1", borderRadius: "2px" }}></div>
                        <div style={{ height: "8px", width: "20%", background: "var(--color-primary)", borderRadius: "2px" }}></div>
                      </div>
                    </div>

                    <div style={{ border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "1rem", flexGrow: 1, opacity: 0.6, cursor: "not-allowed", background: "#1e293b", color: "#f8fafc" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600 }}>Midnight Slate (Dark)</span>
                        <span className="badge badge-warning" style={{ fontSize: "0.6rem" }}>LOCKED</span>
                      </div>
                      <div style={{ height: "12px", width: "100%", background: "#334155", borderRadius: "2px", marginTop: "1rem" }}></div>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <div style={{ height: "8px", width: "40%", background: "#475569", borderRadius: "2px" }}></div>
                        <div style={{ height: "8px", width: "20%", background: "#38bdf8", borderRadius: "2px" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr style={{ border: 0, borderBottom: "1px solid var(--border-light)" }} />

                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>SaaS Account Status</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                    Your current subcription tier.
                  </p>
                  <span className="badge badge-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}>Starter Developer Tier (Free Sandbox)</span>
                </div>
              </div>
            </div>
          )}

          {/* META DEVELOPER GUIDE TAB */}
          {activeTab === "meta-guide" && (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <h3 style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiCpu style={{ color: "var(--color-primary)" }} /> Meta API Integration Guide
              </h3>
              
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                Follow this comprehensive walkthrough to connect your active production Instagram Business Accounts and Facebook Pages to the AutoDM backend.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                {/* Step 1 */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem" }}>Create a Meta Developer App</h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                      Go to <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline", fontWeight: 600 }}>Meta for Developers</a>. Click <strong>Create App</strong>, select the <strong>Business</strong> app type, and follow the setup prompts.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem" }}>Configure Messenger and Instagram Graph products</h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                      Inside your Developer App Dashboard, click <strong>Add Product</strong>. Install:
                      <br />
                      &bull; <strong>Messenger</strong>: To manage Facebook Page DMs.
                      <br />
                      &bull; <strong>Instagram Graph API</strong>: To manage Instagram DMs.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem" }}>Add Environment Variables (.env.local)</h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                      Populate your Next.js project settings in a <code>.env.local</code> file in your directory root:
                    </p>
                    <pre style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border-light)", padding: "0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", marginTop: "0.5rem", overflowX: "auto", fontFamily: "var(--font-mono)" }}>
                      NEXT_PUBLIC_META_APP_ID=your_facebook_app_id
                      META_APP_SECRET=your_facebook_app_secret
                      META_WEBHOOK_VERIFY_TOKEN=your_custom_secure_token
                      NEXT_PUBLIC_SITE_URL=http://localhost:3000
                    </pre>
                  </div>
                </div>

                {/* Step 4 */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                    4
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem" }}>Configure Webhook Web Address</h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                      In the Meta Developer dashboard, navigate to the Webhooks product tab. 
                      <br />
                      &bull; Set your Callback URL to: <code>https://yourdomain.com/api/webhook</code> (use tools like <em>ngrok</em> to tunnel your localhost:3000 to public HTTPS).
                      <br />
                      &bull; Set your Verification Token to the same string you put in <code>META_WEBHOOK_VERIFY_TOKEN</code>.
                      <br />
                      &bull; Subscribe to <strong>messages</strong> and <strong>messaging_postbacks</strong> webhooks.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                    5
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem" }}>Generate Page Tokens & Request Permissions</h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                      Link your Facebook Page and Instagram Account inside the Facebook product dashboard to request Page Access Tokens. Ensure the developer account has admin privileges on the Pages you want to connect.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
