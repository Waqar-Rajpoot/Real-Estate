"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full z-100 bg-white border-b border-gray-100 shadow-sm py-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">

          {/* ── LOGO ─────────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-18 h-18 shrink-0">
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                className="object-contain p-0.5"
              />
            </div>
          </Link>

          {/* ── DESKTOP NAV ──────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50"
            >
              About Us
            </Link>
            <Link
              href="/properties"
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50"
            >
              Properties <ChevronDown size={13} className="ml-0.5 opacity-50" />
            </Link>
          </div>

          {/* ── RIGHT SIDE ───────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 text-sm font-black text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-2xl transition-all duration-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-2 text-sm font-black bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 active:scale-95"
              >
                <User size={16} />
                LOGIN
              </Link>
            )}
          </div>

          {/* ── MOBILE MENU BUTTON ───────────────────────────────────────── */}
          <button
            className="md:hidden p-2 rounded-xl bg-gray-50 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ──────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-4 text-gray-800 font-bold text-base rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-4 text-gray-800 font-bold text-base rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-4 text-gray-800 font-bold text-base rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Properties <ChevronDown size={16} className="opacity-50" />
            </Link>

            <div className="h-px bg-gray-100 my-4" />

            {session ? (
              <button
                onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                className="flex items-center gap-3 px-4 py-4 text-red-500 font-black text-base w-full bg-red-50 rounded-2xl"
              >
                <LogOut size={20} /> Logout Account
              </button>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-2xl font-black text-base shadow-lg shadow-blue-100"
              >
                Login to Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;