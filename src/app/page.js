"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { FiZap, FiLink, FiCpu, FiMessageCircle, FiCheck, FiArrowRight, FiPlus, FiMinus } from "react-icons/fi";
import { useState } from "react";

export default function LandingPage() {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "Is AutoDM approved by Meta/Facebook?",
      a: "Yes, absolutely! AutoDM is built on top of the official Meta Graph API and Messenger Platform API. We comply with all Meta policies and guidelines, ensuring your accounts remain safe and in good standing."
    },
    {
      q: "Can I test it before connecting my Meta accounts?",
      a: "Yes, you can! AutoDM includes a fully functional Developer Simulator/Testing Mode. You can create keyword replies and test them inside our built-in interactive mobile chat preview without any Meta developer setup."
    },
    {
      q: "How does the keyword auto-reply work?",
      a: "When a customer sends you a DM on Instagram or Facebook Page, Meta triggers a webhook event. AutoDM analyzes the text of that message. If it contains any of your defined keywords (e.g., 'price' or 'discount'), our system instantly fires back the specified reply."
    },
    {
      q: "Are there limits on the number of messages?",
      a: "Our Starter plan includes 100 auto-replies per month. The Pro Business plan gives you unlimited auto-replies, multi-account syncing, and detailed response analytics."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)" }}>
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="brand-logo">
          <div className="brand-logo-dot"></div>
          AutoDM
        </div>
        <ul className="nav-links">
          <li><a href="#features" className="nav-link">Features</a></li>
          <li><a href="#how-it-works" className="nav-link">How It Works</a></li>
          <li><a href="#pricing" className="nav-link">Pricing</a></li>
          <li><a href="#faq" className="nav-link">FAQs</a></li>
        </ul>
        <div style={{ display: "flex", gap: "1rem" }}>
          {user ? (
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard <FiArrowRight />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary btn-sm" style={{ padding: "0.6rem 1.2rem" }}>
                Login
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm" style={{ padding: "0.6rem 1.2rem" }}>
                Start Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">⚡ Now in Public Testing Mode</div>
        <h1 className="hero-title">
          Automate Your Instagram & Facebook <span>DMs in Minutes</span>
        </h1>
        <p className="hero-subtitle">
          Instantly respond to customer inquiries, send discount codes, and capture high-intent leads using keyword-based auto replies. Built on official Meta APIs.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
              Enter Dashboard
            </Link>
          ) : (
            <>
              <Link href="/signup" className="btn btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
                Get Started Free <FiArrowRight />
              </Link>
              <Link href="/login" className="btn btn-secondary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
                Try Demo Mode
              </Link>
            </>
          )}
        </div>

        {/* Floating Mockup Preview container */}
        <div className="hero-mockup card" style={{ padding: 0 }}>
          <div style={{ height: "45px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", padding: "0 1.5rem", gap: "0.5rem", borderBottom: "1px solid var(--border-light)" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#eab308" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }}></div>
            <div style={{ flexGrow: 1, textAlign: "center", fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>app.autodm.com/dashboard</div>
          </div>
          <div style={{ display: "flex", height: "calc(100% - 45px)" }}>
            {/* Sidebar Mock */}
            <div style={{ width: "180px", backgroundColor: "#fafafa", borderRight: "1px solid var(--border-light)", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ height: "24px", width: "100px", background: "var(--gradient-primary)", borderRadius: "6px" }}></div>
              <div style={{ height: "18px", width: "120px", backgroundColor: "#e2e8f0", borderRadius: "4px" }}></div>
              <div style={{ height: "18px", width: "110px", backgroundColor: "#e2e8f0", borderRadius: "4px" }}></div>
              <div style={{ height: "18px", width: "130px", backgroundColor: "var(--color-primary-light)", borderRadius: "4px" }}></div>
              <div style={{ height: "18px", width: "90px", backgroundColor: "#e2e8f0", borderRadius: "4px" }}></div>
            </div>
            {/* Main Content Mock */}
            <div style={{ flexGrow: 1, padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ height: "28px", width: "180px", backgroundColor: "#0f172a", borderRadius: "6px" }}></div>
                <div style={{ height: "36px", width: "120px", background: "var(--gradient-primary)", borderRadius: "8px" }}></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div style={{ height: "90px", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ height: "12px", width: "60px", backgroundColor: "#94a3b8", borderRadius: "2px", marginBottom: "0.5rem" }}></div>
                  <div style={{ height: "28px", width: "40px", backgroundColor: "#0f172a", borderRadius: "4px" }}></div>
                </div>
                <div style={{ height: "90px", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ height: "12px", width: "70px", backgroundColor: "#94a3b8", borderRadius: "2px", marginBottom: "0.5rem" }}></div>
                  <div style={{ height: "28px", width: "45px", backgroundColor: "#0f172a", borderRadius: "4px" }}></div>
                </div>
                <div style={{ height: "90px", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
                  <div style={{ height: "12px", width: "80px", backgroundColor: "#94a3b8", borderRadius: "2px", marginBottom: "0.5rem" }}></div>
                  <div style={{ height: "28px", width: "50px", backgroundColor: "#0f172a", borderRadius: "4px" }}></div>
                </div>
              </div>
              <div style={{ flexGrow: 1, border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#cbd5e1" }}></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flexGrow: 1 }}>
                    <div style={{ height: "12px", width: "80px", backgroundColor: "#475569", borderRadius: "2px" }}></div>
                    <div style={{ height: "28px", backgroundColor: "#f1f5f9", borderRadius: "6px", width: "80%" }}></div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignSelf: "flex-end", flexDirection: "row-reverse", width: "100%" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--gradient-primary)" }}></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-end", flexGrow: 1 }}>
                    <div style={{ height: "12px", width: "50px", backgroundColor: "#2563eb", borderRadius: "2px" }}></div>
                    <div style={{ height: "32px", background: "var(--gradient-primary)", borderRadius: "6px", width: "70%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "5rem 0", borderTop: "1px solid var(--border-light)" }}>
        <div className="section-header">
          <h2 className="section-title">Everything you need to automate conversations</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Deliver premium support experiences, run targeted messaging campaigns, and reply instantly.
          </p>
        </div>

        <div className="features-grid">
          <div className="card card-hover">
            <div className="feature-icon-wrapper"><FiZap /></div>
            <h3>Keyword Triggers</h3>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Define specific key terms like &quot;price&quot;, &quot;discount&quot;, or &quot;catalog&quot;. When users type these, our system auto-replies instantly.
            </p>
          </div>

          <div className="card card-hover">
            <div className="feature-icon-wrapper"><FiLink /></div>
            <h3>Instagram & FB Sync</h3>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Connect your business accounts with a single click. Manage automation settings for Facebook Messenger and Instagram DM under one roof.
            </p>
          </div>

          <div className="card card-hover">
            <div className="feature-icon-wrapper"><FiCpu /></div>
            <h3>Real-time Webhook Engine</h3>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Built directly on Meta&apos;s Webhook platform. Messages are intercepted, matched, and replied to in under 400 milliseconds.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "5rem 0", backgroundColor: "white", borderTop: "1px solid var(--border-light)" }}>
        <div className="section-header">
          <h2 className="section-title">Set up in 3 easy steps</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Go from zero to active DMs in less than 5 minutes.
          </p>
        </div>

        <div className="features-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: "1rem" }}>01</div>
            <h3 style={{ marginBottom: "0.5rem" }}>Connect Accounts</h3>
            <p style={{ color: "var(--text-secondary)" }}>Link your Instagram Business Account or Facebook Page securely using our Meta OAuth connection.</p>
          </div>
          <div style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: "1rem" }}>02</div>
            <h3 style={{ marginBottom: "0.5rem" }}>Set Keyword Rules</h3>
            <p style={{ color: "var(--text-secondary)" }}>Define target phrases and input the automated messages you want to fire when triggered.</p>
          </div>
          <div style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: "1rem" }}>03</div>
            <h3 style={{ marginBottom: "0.5rem" }}>Go Live & Track</h3>
            <p style={{ color: "var(--text-secondary)" }}>Watch notifications fire in real-time and monitor total trigger events on your dashboard.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: "5rem 0", borderTop: "1px solid var(--border-light)" }}>
        <div className="section-header">
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p style={{ color: "var(--text-secondary)" }}>Start for free and scale as your social presence grows.</p>
        </div>

        <div className="pricing-grid">
          <div className="card pricing-card">
            <h3>Starter</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>For creators & small accounts</p>
            <div className="price">₹0<span>/month</span></div>
            <hr style={{ border: 0, borderBottom: "1px solid var(--border-light)", margin: "1.5rem 0" }} />
            <ul className="pricing-features">
              <li><FiCheck /> 1 Connected Account</li>
              <li><FiCheck /> 3 Active Automations</li>
              <li><FiCheck /> 100 Auto-Replies / Month</li>
              <li><FiCheck /> Testing Developer Simulator</li>
              <li style={{ color: "var(--text-muted)" }}><FiCheck /> Premium Analytics</li>
            </ul>
            <Link href="/signup" className="btn btn-secondary" style={{ width: "100%" }}>Get Started Free</Link>
          </div>

          <div className="card pricing-card popular">
            <div className="popular-badge">POPULAR</div>
            <h3>Pro Business</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>For scaling brands & agencies</p>
            <div className="price">₹1,999<span>/month</span></div>
            <hr style={{ border: 0, borderBottom: "1px solid var(--border-light)", margin: "1.5rem 0" }} />
            <ul className="pricing-features">
              <li><FiCheck /> Unlimited Connected Accounts</li>
              <li><FiCheck /> Unlimited Automations</li>
              <li><FiCheck /> Unlimited Auto-Replies</li>
              <li><FiCheck /> Real-time Analytics Dashboard</li>
              <li><FiCheck /> Meta Webhook Priority Queue</li>
              <li><FiCheck /> 24/7 Dedicated Support</li>
            </ul>
            <Link href="/signup" className="btn btn-primary" style={{ width: "100%" }}>Upgrade to Pro</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "5rem 0", backgroundColor: "white", borderTop: "1px solid var(--border-light)" }}>
        <div className="section-header">
          <h2 className="section-title">What creators say about us</h2>
          <p style={{ color: "var(--text-secondary)" }}>Hear from agencies and founders who scaled conversions.</p>
        </div>

        <div className="testimonials-grid">
          <div className="card">
            <p style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
              &quot;AutoDM helped us scale our sales inquiries on Instagram. We created a keyword rule for &apos;price&apos; and saw sales conversions increase by 32% in the first week!&quot;
            </p>
            <div className="testimonial-user">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=creative" alt="User avatar" className="testimonial-avatar" />
              <div>
                <h4 style={{ fontSize: "0.95rem" }}>Sarah Jenkins</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>E-Commerce Founder</p>
              </div>
            </div>
          </div>

          <div className="card">
            <p style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
              &quot;The developer simulator made setting this up incredibly simple. We tested our keyword reply strings in real-time on our dashboards before turning the Meta webhooks active.&quot;
            </p>
            <div className="testimonial-user">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=marketing" alt="User avatar" className="testimonial-avatar" />
              <div>
                <h4 style={{ fontSize: "0.95rem" }}>David Miller</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Digital Agency Owner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "5rem 0", borderTop: "1px solid var(--border-light)" }}>
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p style={{ color: "var(--text-secondary)" }}>Got questions? We have answers.</p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item" onClick={() => toggleFaq(idx)}>
              <div className="faq-question">
                <span>{faq.q}</span>
                {activeFaq === idx ? <FiMinus /> : <FiPlus />}
              </div>
              {activeFaq === idx && (
                <div className="faq-answer">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand-logo">
              <div className="brand-logo-dot"></div>
              AutoDM
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Automate customer interactions, replies, and sales on Messenger and Instagram.
            </p>
          </div>
          <div className="footer-col">
            <h4 style={{ fontSize: "1rem" }}>Product</h4>
            <ul className="footer-links">
              <li><a href="#features" className="nav-link">Features</a></li>
              <li><a href="#pricing" className="nav-link">Pricing</a></li>
              <li><a href="#faq" className="nav-link">FAQs</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 style={{ fontSize: "1rem" }}>Integrations</h4>
            <ul className="footer-links">
              <li><span className="nav-link" style={{ cursor: "default" }}>Instagram Direct</span></li>
              <li><span className="nav-link" style={{ cursor: "default" }}>Facebook Messenger</span></li>
              <li><span className="nav-link" style={{ cursor: "default" }}>Meta Graph API</span></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 style={{ fontSize: "1rem" }}>Legal</h4>
            <ul className="footer-links">
              <li><Link href="/privacy" className="nav-link">Privacy Policy</Link></li>
              <li><Link href="/terms" className="nav-link">Terms of Service</Link></li>
              <li><Link href="/data-deletion" className="nav-link">Data Deletion Instructions</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} AutoDM Platform. Built on official Meta and Firebase API suites.
        </div>
      </footer>
    </div>
  );
}
