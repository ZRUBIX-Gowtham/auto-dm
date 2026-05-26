"use client";

import { useState } from "react";

export default function DataDeletionForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [igUsername, setIgUsername] = useState("");
  const [deletionType, setDeletionType] = useState("all");
  const [confirm, setConfirm] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !name || !confirm) return;

    setStatus("loading");

    // Simulate API request to Firebase / Backend
    setTimeout(() => {
      const generatedTicket = "DEL-" + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedTicket);
      setStatus("success");
      
      // Store in localStorage for demonstration/simulation purposes
      try {
        const existingRequests = JSON.parse(localStorage.getItem("data_deletion_requests") || "[]");
        existingRequests.push({
          ticketId: generatedTicket,
          email,
          name,
          igUsername,
          deletionType,
          timestamp: new Date().toISOString(),
          status: "pending"
        });
        localStorage.setItem("data_deletion_requests", JSON.stringify(existingRequests));
      } catch (err) {
        console.error("Storage error:", err);
      }
    }, 1500);
  };

  if (status === "success") {
    return (
      <div style={{
        textAlign: "center",
        padding: "2rem",
        borderRadius: "16px",
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        animation: "fadeIn 0.5s ease"
      }}>
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: "#10b981",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
          fontSize: "2rem",
          boxShadow: "0 8px 16px rgba(16, 185, 129, 0.2)"
        }}>
          ✓
        </div>
        <h3 style={{ fontSize: "1.5rem", color: "#0f172a", fontWeight: "700", marginBottom: "0.5rem" }}>
          Request Submitted Successfully
        </h3>
        <p style={{ color: "#475569", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          Your data deletion ticket has been registered. We are processing your request.
        </p>
        
        <div style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          maxWidth: "320px",
          margin: "0 auto 1.5rem"
        }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8", display: "block", marginBottom: "0.25rem" }}>
            Reference Ticket ID
          </span>
          <span style={{ fontFamily: "monospace", fontSize: "1.25rem", fontWeight: "700", color: "#2563eb", letterSpacing: "1px" }}>
            {ticketId}
          </span>
        </div>

        <p style={{ color: "#64748b", fontSize: "0.85rem", fontStyle: "italic" }}>
          A confirmation email will be sent to <strong>{email}</strong> once your data is permanently scrubbed (typically within 24-48 hours).
        </p>

        <button 
          onClick={() => {
            setName("");
            setEmail("");
            setIgUsername("");
            setConfirm(false);
            setStatus("idle");
          }}
          className="btn btn-secondary btn-sm"
          style={{ marginTop: "1.5rem" }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="form-group" style={{ marginBottom: "0" }}>
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            className="form-control" 
            required 
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "loading"}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "0" }}>
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            className="form-control" 
            required 
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: "0" }}>
        <label className="form-label">Connected Instagram Username (Optional)</label>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
            fontWeight: "500"
          }}>@</span>
          <input 
            type="text" 
            className="form-control" 
            placeholder="yourhandle"
            style={{ paddingLeft: "2rem", width: "100%" }}
            value={igUsername}
            onChange={(e) => setIgUsername(e.target.value)}
            disabled={status === "loading"}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: "0" }}>
        <label className="form-label">Scope of Deletion</label>
        <select 
          className="form-control"
          value={deletionType}
          onChange={(e) => setDeletionType(e.target.value)}
          disabled={status === "loading"}
          style={{ width: "100%", cursor: "pointer" }}
        >
          <option value="all">Delete Entire Account & All Linked Data (Permanent)</option>
          <option value="tokens">Disconnect Access Tokens & Platforms Only</option>
          <option value="logs">Clear Message & Analytics History Logs Only</option>
        </select>
      </div>

      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        backgroundColor: "#f8fafc",
        padding: "1rem",
        borderRadius: "10px",
        border: "1px solid #e2e8f0"
      }}>
        <input 
          type="checkbox" 
          id="confirm-deletion"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
          disabled={status === "loading"}
          style={{ marginTop: "0.25rem", cursor: "pointer", width: "16px", height: "16px" }}
        />
        <label htmlFor="confirm-deletion" style={{ fontSize: "0.85rem", color: "#475569", cursor: "pointer", lineHeight: "1.4" }}>
          I confirm that I want to delete the requested data. I understand this action cannot be undone and that all automation rules associated will stop working.
        </label>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={!confirm || status === "loading" || !email || !name}
        style={{
          width: "100%",
          padding: "1rem",
          justifyContent: "center",
          fontWeight: "700",
          opacity: (!confirm || !email || !name) ? 0.6 : 1,
          cursor: (!confirm || !email || !name) ? "not-allowed" : "pointer"
        }}
      >
        {status === "loading" ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "18px",
              height: "18px",
              border: "2px solid white",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            Processing Request...
          </div>
        ) : "Submit Deletion Request"}
      </button>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </form>
  );
}
