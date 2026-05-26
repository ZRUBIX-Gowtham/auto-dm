"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { FiGrid, FiLink, FiZap, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Define navigation items
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiGrid /> },
    { name: "Automation Builder", path: "/automations", icon: <FiZap /> },
    { name: "Connected Accounts", path: "/connected-accounts", icon: <FiLink /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> },
  ];

  const handleToggle = () => setIsOpen(!isOpen);

  // If user is not logged in, do not render sidebar (e.g. on landing/auth pages)
  if (!user) return null;

  return (
    <>
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div className="brand-logo">
          <div className="brand-logo-dot"></div>
          AutoDM
        </div>
        <button className="mobile-menu-toggle" onClick={handleToggle} aria-label="Toggle menu">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </header>

      {/* Sidebar Drawer */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <Link href="/dashboard" className="brand-logo" onClick={() => setIsOpen(false)}>
            <div className="brand-logo-dot"></div>
            AutoDM
          </Link>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span style={{ display: "flex", fontSize: "1.2rem" }}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`}
              alt={user.displayName || "User avatar"}
              className="sidebar-user-avatar"
            />
            <div className="sidebar-user-details">
              <p className="sidebar-user-name">{user.displayName || "SaaS User"}</p>
              <p className="sidebar-user-role" title={user.email}>{user.email}</p>
            </div>
          </div>
          <button className="sidebar-logout" onClick={logout} title="Sign Out">
            <FiLogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="modal-backdrop" 
          style={{ zIndex: 98, backgroundColor: "rgba(15, 23, 42, 0.2)" }} 
          onClick={handleToggle}
        />
      )}
    </>
  );
}
