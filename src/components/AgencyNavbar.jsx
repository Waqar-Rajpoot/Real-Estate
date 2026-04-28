"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  Users,
  LayoutDashboard,
  UserPlus,
  UserCircle,
} from "lucide-react";

const AgencyNavbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/agency/dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    {
      name: "My Agents",
      href: "/agency/agents",
      icon: <Users size={16} />,
    },
    {
      name: "Add Agent",
      href: "/agency/add-agent",
      icon: <UserPlus size={16} />,
    },
    {
      name: "Agency Profile",
      href: "/agency/profile",
      icon: <UserCircle size={16} />,
    },
  ];

  return (
    <>
      {/* ── FIXED NAVBAR ────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white shadow-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            
            {/* ── LOGO ────────────────────────────────────────────────────── */}
            <Link
              href="/agency/dashboard"
              className="flex items-center gap-2.5 shrink-0"
            >
              <div className="relative w-18 h-18 shrink-0">
                <Image
                  src="/logo.01.svg"
                  alt="LeadsToKey"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </div>
            </Link>

            {/* ── DESKTOP NAV ──────────────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded transition-colors duration-200 ${
                      isActive 
                        ? "text-blue-600 bg-blue-50/50" 
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {link.icon} {link.name}
                  </Link>
                );
              })}
            </div>

            {/* ── RIGHT SIDE ───────────────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-3">
              {session && (
                <button
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  className="flex items-center gap-2 text-sm font-bold transition-colors duration-200 px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              )}
            </div>

            {/* ── MOBILE MENU BUTTON ───────────────────────────────────────── */}
            <button
              className="md:hidden p-2 rounded transition-colors duration-200 text-gray-600 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU OVERLAY ─────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 font-bold text-sm rounded transition-colors ${
                      isActive 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-blue-600">
                      {link.icon}
                    </span> 
                    {link.name}
                  </Link>
                );
              })}

              <div className="h-px bg-gray-100 my-2" />

              {session && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/sign-in" });
                  }}
                  className="flex items-center gap-3 px-3 py-3 text-red-500 font-bold text-sm w-full transition-colors hover:bg-red-50 rounded"
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── SPACER ──────────────────────────────────────────────────────────
          This div prevents content from hiding behind the fixed navbar.
          The height (h-[72px]) matches the total height of your navbar.
      ────────────────────────────────────────────────────────────────────── */}
      <div className="h-[72px] w-full" />
    </>
  );
};

export default AgencyNavbar;