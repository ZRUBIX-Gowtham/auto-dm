"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/components/AuthProvider";
import { 
  subscribeToAutomations, 
  subscribeToConnectedAccounts, 
  subscribeToRecentMessages 
} from "@/firebase/db";
import { FiZap, FiLink, FiMessageCircle, FiActivity, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  
  const [automations, setAutomations] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [metrics, setMetrics] = useState({
    totalAutomations: 0,
    activeAutomations: 0,
    connectedAccounts: 0,
    totalTriggers: 0
  });

  useEffect(() => {
    if (!user) return;

    const userId = user.uid;

    // 1. Subscribe to Automations
    const unsubscribeAutomations = subscribeToAutomations(userId, (data) => {
      setAutomations(data);
      
      const activeCount = data.filter(a => a.isActive).length;
      const triggerCount = data.reduce((acc, curr) => acc + (curr.timesTriggered || 0), 0);
      
      setMetrics(prev => ({
        ...prev,
        totalAutomations: data.length,
        activeAutomations: activeCount,
        totalTriggers: triggerCount
      }));
    });

    // 2. Subscribe to Connected Accounts
    const unsubscribeAccounts = subscribeToConnectedAccounts(userId, (data) => {
      setAccounts(data);
      setMetrics(prev => ({
        ...prev,
        connectedAccounts: data.length
      }));
    });

    // 3. Subscribe to Recent Message Logs
    const unsubscribeMessages = subscribeToRecentMessages(userId, (data) => {
      setMessages(data);
    });

    return () => {
      unsubscribeAutomations();
      unsubscribeAccounts();
      unsubscribeMessages();
    };
  }, [user]);

  // Format timestamp Helper
  const formatTimeAgo = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;
    
    return "just now";
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Dashboard Overview</h1>
          <p className="page-subtitle">Track your automated reply performance and statistics</p>
        </div>
        <Link href="/automations" className="btn btn-primary btn-sm">
          <FiZap /> Create Automation
        </Link>
      </div>

      {/* Analytics Cards Grid */}
      <div className="analytics-grid">
        <div className="card analytics-card">
          <div className="analytics-details">
            <span className="analytics-label">Total Rules</span>
            <span className="analytics-value">{metrics.totalAutomations}</span>
          </div>
          <div className="analytics-icon blue">
            <FiZap />
          </div>
        </div>

        <div className="card analytics-card">
          <div className="analytics-details">
            <span className="analytics-label">Active Rules</span>
            <span className="analytics-value">{metrics.activeAutomations}</span>
          </div>
          <div className="analytics-icon green">
            <FiCheckCircle />
          </div>
        </div>

        <div className="card analytics-card">
          <div className="analytics-details">
            <span className="analytics-label">Connected Accounts</span>
            <span className="analytics-value">{metrics.connectedAccounts}</span>
          </div>
          <div className="analytics-icon purple">
            <FiLink />
          </div>
        </div>

        <div className="card analytics-card">
          <div className="analytics-details">
            <span className="analytics-label">Total Replies Sent</span>
            <span className="analytics-value">{metrics.totalTriggers}</span>
          </div>
          <div className="analytics-icon orange">
            <FiMessageCircle />
          </div>
        </div>
      </div>

      {/* Dashboard Columns */}
      <div className="dashboard-layout">
        {/* Left Column: Recent Activity Logs */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiActivity style={{ color: "var(--color-primary)" }} /> Recent Auto-Reply Events
            </h3>
            <span className="badge badge-primary">{messages.length} logged</span>
          </div>

          {messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-secondary)" }}>
              <FiMessageCircle size={40} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
              <p style={{ fontWeight: 600 }}>No replies triggered yet</p>
              <p style={{ fontSize: "0.875rem" }}>Triggered keyword responses will appear here in real-time.</p>
            </div>
          ) : (
            <ul className="activity-list">
              {messages.map((msg) => (
                <li key={msg.id} className="activity-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={msg.senderPic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderName}`} 
                    alt={msg.senderName} 
                    className="activity-avatar"
                  />
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-sender">@{msg.senderName}</span>
                      <span className="activity-time">{formatTimeAgo(msg.timestamp)}</span>
                    </div>
                    
                    <div className="activity-message">
                      <span style={{ fontSize: "0.75rem", display: "block", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.15rem" }}>INBOUND MESSAGE</span>
                      &quot;{msg.receivedMessage}&quot;
                    </div>

                    <div className="activity-reply">
                      <span className="badge badge-success" style={{ padding: "0.15rem 0.5rem", fontSize: "0.65rem" }}>
                        Keyword: {msg.triggeredKeyword}
                      </span>
                      <FiArrowRight size={14} style={{ color: "var(--text-muted)" }} />
                      <div style={{ background: "var(--color-primary-light)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", color: "var(--color-primary)", flexGrow: 1, fontSize: "0.875rem" }}>
                        <span style={{ fontSize: "0.75rem", display: "block", color: "var(--color-primary)", opacity: 0.8, fontWeight: 700, marginBottom: "0.15rem" }}>AUTO REPLY SENT</span>
                        {msg.sentReply}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Column: Platform Status & Quick Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Active Channels Card */}
          <div className="card">
            <h3 style={{ marginBottom: "1.25rem" }}>Connected Platforms</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Instagram Card */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ background: "var(--color-instagram)", color: "white", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                    <FiMessageCircle />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.875rem" }}>Instagram Business</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {accounts.filter(a => a.platform === "instagram").length > 0 
                        ? `@${accounts.find(a => a.platform === "instagram").username}` 
                        : "Not Connected"}
                    </p>
                  </div>
                </div>
                {accounts.filter(a => a.platform === "instagram").length > 0 ? (
                  <span className="badge badge-success">ACTIVE</span>
                ) : (
                  <span className="badge badge-danger">INACTIVE</span>
                )}
              </div>

              {/* Facebook Card */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ backgroundColor: "var(--color-facebook)", color: "white", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                    <FiMessageCircle />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.875rem" }}>Facebook Messenger</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {accounts.filter(a => a.platform === "facebook").length > 0 
                        ? accounts.find(a => a.platform === "facebook").displayName
                        : "Not Connected"}
                    </p>
                  </div>
                </div>
                {accounts.filter(a => a.platform === "facebook").length > 0 ? (
                  <span className="badge badge-success">ACTIVE</span>
                ) : (
                  <span className="badge badge-danger">INACTIVE</span>
                )}
              </div>
            </div>
            
            <Link href="/connected-accounts" className="btn btn-secondary btn-sm" style={{ width: "100%", marginTop: "1.25rem" }}>
              Manage Connections
            </Link>
          </div>

          {/* Quick Help Guide */}
          <div className="card" style={{ background: "var(--gradient-light)", borderColor: "rgba(37, 99, 235, 0.15)" }}>
            <h4 style={{ color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <FiZap /> Simulation Simulator
            </h4>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.5 }}>
              Use the <strong>Automation Builder</strong> to test your active keyword triggers in our virtual smartphone emulator. Send mock DMs and watch replies fire instantly!
            </p>
            <Link href="/automations" className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }}>
              Launch Builder
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
