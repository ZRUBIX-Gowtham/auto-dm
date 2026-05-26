"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpWithEmail, logInWithGoogle } from "@/firebase/auth";
import { isSimulationMode } from "@/firebase/config";
import { useAuth } from "@/components/AuthProvider";
import { FiUser, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If user is already logged in, redirect straight to dashboard
    if (user && !authLoading) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.message.includes("auth/email-already-in-use")) {
        setError("This email address is already in use.");
      } else {
        setError(err.message || "Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await logInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Background glowing blobs */}
      <div className="auth-bg-shapes">
        <div className="auth-shape auth-shape-1"></div>
        <div className="auth-shape auth-shape-2"></div>
      </div>

      <div className="card auth-card animate-pulse-glow">
        <div className="auth-header">
          <div className="brand-logo auth-logo">
            <div className="brand-logo-dot"></div>
            AutoDM
          </div>
          <h2>Create Account</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Get started for free today, no credit card required
          </p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ width: "100%", padding: "0.75rem", textTransform: "none", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", borderRadius: "var(--radius-sm)", fontWeight: 500 }}>
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {isSimulationMode && (
          <div className="badge badge-primary" style={{ width: "100%", padding: "0.75rem", textTransform: "none", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.25rem", marginBottom: "1.5rem", borderRadius: "var(--radius-sm)", fontWeight: 500, lineHeight: 1.4 }}>
            <span style={{ fontWeight: 700 }}>🧪 DEMO SIMULATION MODE ACTIVE</span>
            <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>Firebase credentials not configured. Create an account instantly in local storage.</span>
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: "relative" }}>
              <FiUser style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: "2.5rem", width: "100%" }}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: "relative" }}>
              <FiMail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: "2.5rem", width: "100%" }}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <FiLock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "2.5rem", width: "100%" }}
                disabled={loading}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", height: "48px" }} disabled={loading}>
            {loading ? <div className="spinner" style={{ borderTopColor: "white", width: "20px", height: "20px" }}></div> : "Sign Up"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <button onClick={handleGoogleLogin} className="btn btn-google" style={{ width: "100%", height: "48px" }} disabled={loading}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" style={{ width: "18px", height: "18px" }} />
          Continue with Google
        </button>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
