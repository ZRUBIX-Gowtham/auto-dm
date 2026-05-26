"use client";

import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/components/AuthProvider";
import { 
  subscribeToAutomations, 
  addAutomation, 
  updateAutomation, 
  deleteAutomation,
  logAutoDM
} from "@/firebase/db";
import { 
  FiZap, 
  FiTrash2, 
  FiPlus, 
  FiSmartphone, 
  FiCornerDownLeft, 
  FiToggleLeft, 
  FiToggleRight, 
  FiX, 
  FiInstagram, 
  FiFacebook,
  FiSend
} from "react-icons/fi";

export default function AutomationsPage() {
  const { user } = useAuth();
  
  // States
  const [automations, setAutomations] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);

  // Simulator States
  const [simPlatform, setSimPlatform] = useState("instagram");
  const [simMessages, setSimMessages] = useState([
    { id: "s1", type: "system", text: "Welcome to the Live Sandbox DM Simulator. Select a channel above, then type a message below to test your keyword triggers!" }
  ]);
  const [simInput, setSimInput] = useState("");
  const [simTyping, setSimTyping] = useState(false);

  const chatEndRef = useRef(null);

  // Subscribe to automations list
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToAutomations(user.uid, (data) => {
      setAutomations(data);
    });
    return () => unsubscribe();
  }, [user]);

  // Scroll simulator chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [simMessages, simTyping]);

  // Keywords Tag Input Helpers
  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = keywordInput.trim().toLowerCase();
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (idx) => {
    setKeywords(keywords.filter((_, i) => i !== idx));
  };

  // Create rule handler
  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!ruleName || keywords.length === 0 || !replyText) {
      alert("Please fill in the rule name, add at least one keyword, and write a reply.");
      return;
    }

    setSaving(true);
    try {
      await addAutomation(user?.uid || "demo_user", {
        name: ruleName,
        platform,
        keywords,
        replyText,
        isActive: true
      });
      // Reset Form
      setRuleName("");
      setKeywords([]);
      setReplyText("");
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("Error saving rule: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle active rule
  const handleToggleActive = async (rule) => {
    try {
      await updateAutomation(rule.id, {
        isActive: !rule.isActive
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete rule
  const handleDeleteRule = async (ruleId) => {
    if (confirm("Are you sure you want to delete this automation rule?")) {
      try {
        await deleteAutomation(ruleId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Simulator Message Handler
  const handleSimSend = async (e) => {
    e.preventDefault();
    const txt = simInput.trim();
    if (!txt) return;

    // 1. Add User Inbound message
    const userMsgId = "user_" + Date.now();
    setSimMessages(prev => [
      ...prev,
      { id: userMsgId, type: "inbound", text: txt }
    ]);
    setSimInput("");

    // 2. Trigger automated response checking
    setSimTyping(true);

    setTimeout(async () => {
      setSimTyping(false);
      
      const lowerTxt = txt.toLowerCase();
      
      // Look for active match on current platform
      const matched = automations.find(auto => {
        return (
          auto.isActive &&
          auto.platform === simPlatform &&
          auto.keywords.some(kw => lowerTxt.includes(kw.toLowerCase()))
        );
      });

      if (matched) {
        // Trigger auto reply
        setSimMessages(prev => [
          ...prev,
          { id: "reply_" + Date.now(), type: "outbound", text: matched.replyText }
        ]);

        // Find the matched keyword
        const triggerKw = matched.keywords.find(kw => lowerTxt.includes(kw.toLowerCase()));

        // Log DM Interaction in Firestore (updates statistics)
        await logAutoDM(user?.uid || "demo_user", {
          platform: simPlatform,
          senderName: "sandbox_tester",
          senderPic: "https://api.dicebear.com/7.x/avataaars/svg?seed=sandbox",
          receivedMessage: txt,
          triggeredKeyword: triggerKw,
          sentReply: matched.replyText
        });
      } else {
        // System message warning no match
        setSimMessages(prev => [
          ...prev,
          { id: "sys_" + Date.now(), type: "system", text: `⚠️ No keyword match found for "${txt}" on ${simPlatform === "instagram" ? "Instagram" : "Facebook"}. Try keywords: ${
            automations
              .filter(a => a.isActive && a.platform === simPlatform)
              .flatMap(a => a.keywords)
              .join(", ") || "(No active rules for this channel)"
          }` }
        ]);
      }
    }, 1000);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Automation Builder</h1>
          <p className="page-subtitle">Configure auto-responses triggered by specific keywords in incoming DMs</p>
        </div>
      </div>

      <div className="builder-layout">
        {/* Left Column - Rules List & Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* New Rule Toggle Drawer */}
          {isCreating ? (
            <div className="card" style={{ borderLeft: "4px solid var(--color-primary)", animation: "scaleUp 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3>New Keyword Reply Rule</h3>
                <button className="btn btn-secondary btn-icon" onClick={() => setIsCreating(false)} style={{ padding: "0.25rem" }}>
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateRule}>
                <div className="form-group">
                  <label className="form-label">Rule Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Price Inquiries Reply"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Platform Channel</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", border: "1px solid var(--border-light)", padding: "0.5rem 1rem", borderRadius: "var(--radius-md)", flexGrow: 1, justifyContent: "center" }}>
                      <input
                        type="radio"
                        name="platform"
                        value="instagram"
                        checked={platform === "instagram"}
                        onChange={() => setPlatform("instagram")}
                      />
                      <FiInstagram style={{ color: "#e1306c" }} /> Instagram
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", border: "1px solid var(--border-light)", padding: "0.5rem 1rem", borderRadius: "var(--radius-md)", flexGrow: 1, justifyContent: "center" }}>
                      <input
                        type="radio"
                        name="platform"
                        value="facebook"
                        checked={platform === "facebook"}
                        onChange={() => setPlatform("facebook")}
                      />
                      <FiFacebook style={{ color: "var(--color-facebook)" }} /> Messenger
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Trigger Keywords (press Enter after each word)</label>
                  <div className="keywords-input-wrapper">
                    {keywords.map((kw, i) => (
                      <span key={i} className="keyword-tag">
                        {kw}
                        <button type="button" className="keyword-remove-btn" onClick={() => removeKeyword(i)}>
                          <FiX size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="keywords-raw-input"
                      placeholder={keywords.length === 0 ? "e.g. price, cost, rate" : "Add keyword..."}
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleKeywordKeyDown}
                    />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    If a message contains ANY of these keywords, the response triggers.
                  </span>
                </div>

                <div className="form-group" style={{ marginBottom: "2rem" }}>
                  <label className="form-label">Automatic Reply Text Message</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Type your reply message here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsCreating(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Rule"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button className="btn btn-primary" style={{ width: "100%", height: "54px", display: "flex", gap: "0.5rem" }} onClick={() => setIsCreating(true)}>
              <FiPlus /> Add New Keyword Rule
            </button>
          )}

          {/* Rules List Container */}
          <div className="card">
            <h3 style={{ marginBottom: "1.5rem" }}>Active Keyword Rules</h3>
            {automations.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-secondary)" }}>
                <FiZap size={40} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                <p style={{ fontWeight: 600 }}>No rules configured yet</p>
                <p style={{ fontSize: "0.875rem" }}>Create your first keyword-based DM automation rule above.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {automations.map((rule) => (
                  <div key={rule.id} style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "1.25rem", gap: "1rem" }}>
                    
                    {/* Top Row: Title, Platform, Toggles */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>
                          {rule.platform === "instagram" 
                            ? <FiInstagram style={{ color: "#e1306c" }} title="Instagram" /> 
                            : <FiFacebook style={{ color: "var(--color-facebook)" }} title="Messenger" />
                          }
                        </span>
                        <h4 style={{ fontSize: "1rem" }}>{rule.name}</h4>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <button 
                          onClick={() => handleToggleActive(rule)}
                          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", fontSize: "1.75rem" }}
                          title={rule.isActive ? "Pause Rule" : "Activate Rule"}
                        >
                          {rule.isActive 
                            ? <FiToggleRight style={{ color: "var(--color-success)" }} /> 
                            : <FiToggleLeft style={{ color: "var(--text-muted)" }} />
                          }
                        </button>
                        <button 
                          onClick={() => handleDeleteRule(rule.id)}
                          className="btn btn-secondary btn-icon"
                          style={{ padding: "0.35rem", color: "var(--color-danger)" }}
                          title="Delete Rule"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Keywords List Bubble */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                      {rule.keywords.map((kw, i) => (
                        <span key={i} className="badge badge-primary" style={{ fontSize: "0.75rem", textTransform: "lowercase", fontWeight: 600 }}>
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Reply Text Preview */}
                    <div style={{ background: "var(--bg-page)", borderLeft: "3px solid var(--color-primary)", padding: "0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", fontWeight: 700, marginBottom: "0.15rem" }}>AUTO REPLY</span>
                      {rule.replyText}
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      <span>Triggered: <strong>{rule.timesTriggered || 0} times</strong></span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Simulator Frame */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "2rem" }}>
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <FiSmartphone /> Live Sandbox Tester
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Select a channel and send a mock direct message to test keywords in real-time.
            </p>

            {/* Platform Selector */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <button 
                className={`btn btn-sm ${simPlatform === "instagram" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setSimPlatform("instagram")}
                style={{ flexGrow: 1 }}
              >
                <FiInstagram /> Instagram DM
              </button>
              <button 
                className={`btn btn-sm ${simPlatform === "facebook" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setSimPlatform("facebook")}
                style={{ flexGrow: 1 }}
              >
                <FiFacebook /> Messenger
              </button>
            </div>

            {/* Smartphone Graphic */}
            <div className="simulator-frame">
              {/* Phone Status bar */}
              <div className="simulator-header">
                <div className="simulator-avatar"></div>
                <div style={{ flexGrow: 1 }}>
                  <p className="simulator-user-name">@{simPlatform === "instagram" ? "creative.brand" : "Creative Page"}</p>
                  <p className="simulator-user-status">Active in Sandbox</p>
                </div>
              </div>

              {/* Chat Content */}
              <div className="simulator-chat-area">
                {simMessages.map((msg) => (
                  <div key={msg.id} className={`chat-bubble ${msg.type}`}>
                    {msg.text}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {simTyping && (
                  <div className="chat-bubble inbound" style={{ width: "fit-content", backgroundColor: "#262626", color: "#a3a3a3", display: "flex", gap: "4px", padding: "0.5rem 1rem" }}>
                    <div className="spinner" style={{ width: "12px", height: "12px", border: "2px solid #3a3a3a", borderTopColor: "white" }}></div>
                    <span>Typing...</span>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSimSend} className="simulator-input-area">
                <input
                  type="text"
                  className="simulator-input"
                  placeholder={`Send DM as Customer...`}
                  value={simInput}
                  onChange={(e) => setSimInput(e.target.value)}
                  disabled={simTyping}
                />
                <button type="submit" className="simulator-send-btn" disabled={simTyping || !simInput.trim()}>
                  <FiSend size={16} />
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
