"use client";

import { useEffect, useState, Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/components/AuthProvider";
import {
  subscribeToConnectedAccounts,
  addConnectedAccount,
  deleteConnectedAccount
} from "@/firebase/db";
import { getMetaOAuthUrl } from "@/services/metaApi";
import { isSimulationMode } from "@/firebase/config";
import {
  FiLink,
  FiInstagram,
  FiFacebook,
  FiInfo,
  FiTrash2,
  FiPlus,
  FiCheckCircle,
  FiLock,
  FiAlertCircle,
  FiX
} from "react-icons/fi";
import { useSearchParams, useRouter } from "next/navigation";

function ConnectedAccountsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // States
  const [accounts, setAccounts] = useState([]);
  const [showSimModal, setShowSimModal] = useState(false);
  const [selectedMockPlatform, setSelectedMockPlatform] = useState("facebook");
  const [mockAccountName, setMockAccountName] = useState("");
  const [toast, setToast] = useState(null);

  // Read URL Callback parameters
  useEffect(() => {
    // Quick Seed for simulated OAuth Redirect
    const simulateQuickConnect = async () => {
      const uid = user?.uid || "demo_user";
      await addConnectedAccount(uid, {
        platform: "instagram",
        username: "creative.brand",
        displayName: "Creative Brand Studio",
        profilePicture: "https://api.dicebear.com/7.x/identicon/svg?seed=creative.brand",
        pageId: "10932849204823"
      });
      await addConnectedAccount(uid, {
        platform: "facebook",
        username: "creativebrandfb",
        displayName: "Creative Brand Facebook Page",
        profilePicture: "https://api.dicebear.com/7.x/identicon/svg?seed=creativebrandfb",
        pageId: "582384729384"
      });
    };

    const status = searchParams.get("status");
    const count = searchParams.get("connected");
    const message = searchParams.get("message");

    if (status === "success") {
      setTimeout(() => {
        setToast({ type: "success", text: `Successfully connected ${count || 1} Meta channel(s)!` });
      }, 0);
      // Remove URL queries
      router.replace("/connected-accounts");
    } else if (status === "simulated_success") {
      setTimeout(() => {
        setToast({ type: "success", text: "Simulated OAuth Callback complete! Mock channels connected." });
      }, 0);
      // Seed simulated accounts
      simulateQuickConnect();
      router.replace("/connected-accounts");
    } else if (status === "error") {
      setTimeout(() => {
        setToast({ type: "danger", text: `Connection failed: ${message || "OAuth canceled"}` });
      }, 0);
      router.replace("/connected-accounts");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user]);

  // Subscribe to connected accounts list
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToConnectedAccounts(user.uid, (data) => {
      setAccounts(data);
    });
    return () => unsubscribe();
  }, [user]);

  // Toast clear timeout
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Disconnect handler
  const handleDisconnect = async (accountId) => {
    if (confirm("Disconnecting this page will pause all active auto-replies. Proceed?")) {
      try {
        await deleteConnectedAccount(accountId);
        setToast({ type: "success", text: "Account disconnected successfully." });
      } catch (err) {
        console.error(err);
        setToast({ type: "danger", text: "Failed to disconnect account." });
      }
    }
  };

  // Trigger OAuth Redirect (Real) or Simulator Modal (Demo)
  const handleConnectClick = (plat) => {
    const metaAppId = process.env.NEXT_PUBLIC_META_APP_ID;
    const isMetaConfigured = metaAppId && metaAppId !== "YOUR_META_APP_ID";

    if (isSimulationMode || !isMetaConfigured) {
      setSelectedMockPlatform(plat);
      setMockAccountName(plat === "instagram" ? "ecom.store" : "E-Commerce Page");
      setShowSimModal(true);
    } else {
      // Real Meta OAuth flow redirect
      window.location.href = getMetaOAuthUrl(user?.uid || "demo_user");
    }
  };

  // Submit simulated account
  const handleSimSubmit = async (e) => {
    e.preventDefault();
    if (!mockAccountName) return;

    try {
      const uid = user?.uid || "demo_user";
      const cleanedUsername = mockAccountName.toLowerCase().replace(/\s+/g, "");

      const newAccountPayload = {
        platform: selectedMockPlatform,
        username: selectedMockPlatform === "instagram" ? cleanedUsername : cleanedUsername + "_fb",
        displayName: selectedMockPlatform === "instagram" ? mockAccountName : mockAccountName + " (Facebook Page)",
        profilePicture: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanedUsername}`,
        pageId: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
        pageAccessToken: "simulated_access_token_" + Math.random().toString(36).substring(7)
      };

      await addConnectedAccount(uid, newAccountPayload);
      setShowSimModal(false);
      setToast({ type: "success", text: `Successfully simulated connecting ${mockAccountName}!` });
    } catch (err) {
      console.error(err);
      alert("Failed to connect account: " + err.message);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Connected Accounts</h1>
          <p className="page-subtitle">Manage your linked Facebook Pages and Instagram Business profiles</p>
        </div>
      </div>

      {/* Interactive Toast Notifications */}
      {toast && (
        <div
          className={`badge badge-${toast.type}`}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "0.9rem",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            borderRadius: "var(--radius-md)",
            fontWeight: 600,
            animation: "slideDown 0.3s ease"
          }}
        >
          {toast.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Meta API developer guidelines alert */}
      <div className="card" style={{ background: "var(--gradient-light)", borderColor: "rgba(37, 99, 235, 0.15)", display: "flex", gap: "1.25rem", alignItems: "flex-start", marginBottom: "2rem" }}>
        <FiInfo size={24} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <h4 style={{ color: "var(--color-primary)" }}>Official Meta Connection Guidelines</h4>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.35rem", lineHeight: 1.5 }}>
            To connect production accounts, ensure your Meta App ID, App Secret and Site URLs are correctly configured in your <code>.env.local</code> file. Make sure your Meta App is set up with <strong>instagram_manage_messages</strong> and <strong>pages_messaging</strong> permission scopes.
          </p>
        </div>
      </div>

      {/* Platforms Connect Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {/* Instagram Account Box */}
        <div className="card card-hover" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "center", textAlign: "center" }}>
          <div style={{ background: "var(--color-instagram)", color: "white", width: "54px", height: "54px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FiInstagram />
          </div>
          <div>
            <h3>Instagram Business</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Automate customer replies inside Instagram DMs
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => handleConnectClick("instagram")}>
            <FiPlus /> Connect Instagram
          </button>
        </div>

        {/* Facebook Page Box */}
        <div className="card card-hover" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "center", textAlign: "center" }}>
          <div style={{ backgroundColor: "var(--color-facebook)", color: "white", width: "54px", height: "54px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FiFacebook />
          </div>
          <div>
            <h3>Facebook Messenger</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Automate messaging on Facebook Page inbox
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => handleConnectClick("facebook")}>
            <FiPlus /> Connect Facebook Page
          </button>
        </div>
      </div>

      {/* Connected Accounts List */}
      <div className="card">
        <h3 style={{ marginBottom: "1.5rem" }}>Connected Channels ({accounts.length})</h3>

        {accounts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-secondary)" }}>
            <FiLink size={40} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
            <p style={{ fontWeight: 600 }}>No accounts connected yet</p>
            <p style={{ fontSize: "0.875rem" }}>Connect your Facebook Page or Instagram Business profile above.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {accounts.map((acc) => (
              <div
                key={acc.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 1.25rem",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "white",
                  animation: "scaleIn 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={acc.profilePicture || `https://api.dicebear.com/7.x/identicon/svg?seed=${acc.username}`}
                    alt={acc.displayName}
                    style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <h4 style={{ fontSize: "0.95rem" }}>{acc.displayName}</h4>
                      <span className="badge badge-success" style={{ fontSize: "0.6rem", padding: "0.15rem 0.5rem" }}>CONNECTED</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                      ID: {acc.pageId} &bull; Channel: {acc.platform === "instagram" ? "Instagram Business" : "Facebook Messenger"}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>
                    {acc.platform === "instagram"
                      ? <FiInstagram style={{ color: "#e1306c" }} />
                      : <FiFacebook style={{ color: "var(--color-facebook)" }} />
                    }
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: "var(--color-danger)", borderColor: "var(--border-light)" }}
                    onClick={() => handleDisconnect(acc.id)}
                  >
                    <FiTrash2 /> Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simulated Connect Modal (Demo Sandbox) */}
      {showSimModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiLock /> Sandbox Meta OAuth Login
              </h3>
              <button className="modal-close-btn" onClick={() => setShowSimModal(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSimSubmit}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  This sandbox simulates Meta&apos;s API authentication. Input a mock handle below to attach a channel instantly.
                </p>

                <div className="form-group">
                  <label className="form-label">
                    {selectedMockPlatform === "instagram" ? "Instagram Username" : "Facebook Page Name"}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={selectedMockPlatform === "instagram" ? "e.g. fashion.studio" : "e.g. Fashion Studio FB"}
                    value={mockAccountName}
                    onChange={(e) => setMockAccountName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSimModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Connect Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function ConnectedAccountsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="page-header">
          <div className="page-title-group">
            <h1>Connected Accounts</h1>
            <p className="page-subtitle">Loading connection states...</p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <div className="spinner"></div>
        </div>
      </DashboardLayout>
    }>
      <ConnectedAccountsContent />
    </Suspense>
  );
}
