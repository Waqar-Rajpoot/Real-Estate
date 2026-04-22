"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  FilePlus,
} from "lucide-react";

const AgentNavbar = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed w-full z-100 transition-all duration-300  bg-white shadow-sm py-2`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* ── LOGO ─────────────────────────────────────────────────────── */}
          <Link
            href="/agent/dashboard"
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="relative w-14 h-14 bg-white rounded-lg shadow-sm overflow-hidden shrink-0">
              <Image
                src="/leadstokey-logo.jpeg"
                alt="LeadsToKey"
                fill
                className="object-contain p-0.5"
              />
            </div>
          </Link>

          {/* ── DESKTOP NAV (Agent Routes) ────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/agent/dashboard"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded transition-colors duration-200 text-gray-600 hover:text-blue-600`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link
              href="/agent/list-property"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded transition-colors duration-200 text-gray-600 hover:text-blue-600`}
            >
              <FilePlus size={16} /> List Property
            </Link>
          </div>

          {/* ── RIGHT SIDE ───────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className={`flex items-center gap-2 text-sm font-bold transition-colors duration-200 px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white`}
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                href="/sign-in"
                className={`flex items-center gap-2 text-sm font-bold px-5 py-2 rounded transition-all duration-200 bg-blue-600 text-white hover:bg-blue-500`}
              >
                <User size={16} />
                Login
              </Link>
            )}
          </div>

          {/* ── MOBILE MENU BUTTON ───────────────────────────────────────── */}
          <button
            className={`md:hidden p-2 rounded transition-colors duration-200 text-gray-600 hover:text-blue-600`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ──────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link
              href="/agent/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-gray-700 font-bold text-sm rounded hover:bg-gray-50"
            >
              <LayoutDashboard size={18} className="text-blue-600" /> Dashboard
            </Link>
            <Link
              href="/agent/list-property"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-gray-700 font-bold text-sm rounded hover:bg-gray-50"
            >
              <FilePlus size={18} className="text-blue-600" /> List Property
            </Link>

            <div className="h-px bg-gray-100 my-2" />

            {session ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center gap-3 px-3 py-3 text-red-500 font-bold text-sm w-full"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-bold text-sm transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AgentNavbar;
