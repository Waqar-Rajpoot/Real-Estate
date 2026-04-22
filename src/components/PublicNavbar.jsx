"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, User, PlusCircle, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">

          {/* ── LOGO ─────────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative w-14 h-14 bg-white rounded-lg shadow-sm overflow-hidden flex-shrink-0">
              <Image
                src="/leadstokey-logo.jpeg"
                alt="LeadsToKey"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span
              className={`font-bold text-lg tracking-tight transition-colors duration-300 ${
                isScrolled ? "text-[#0b1c3c]" : "text-white"
              }`}
            >
            </span>
          </Link>

          {/* ── DESKTOP NAV ──────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors duration-200 ${
                isScrolled
                  ? "text-gray-600 hover:text-blue-600"
                  : "text-white hover:text-blue-200"
              }`}
            >
              Home <ChevronDown size={13} />
            </Link>
            <Link
              href="/properties"
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors duration-200 ${
                isScrolled
                  ? "text-gray-600 hover:text-blue-600"
                  : "text-white hover:text-blue-200"
              }`}
            >
              Properties <ChevronDown size={13} />
            </Link>
          </div>

          {/* ── RIGHT SIDE ───────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                {/* Logout */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 px-3 py-2 rounded border ${
                    isScrolled
                      ? "text-gray-600 border-gray-200 hover:text-red-500 hover:border-red-300"
                      : "text-white border-white/30 hover:text-red-300 hover:border-red-300/50"
                  }`}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              /* Login / Register */
              <Link
                href="/sign-in"
                className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded transition-all duration-200 ${
                  isScrolled
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
                }`}
              >
                <User size={16} />
                Login
              </Link>
            )}
          </div>

          {/* ── MOBILE MENU BUTTON ───────────────────────────────────────── */}
          <button
            className={`md:hidden p-2 rounded transition-colors ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ──────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 text-gray-700 font-medium text-sm rounded hover:bg-gray-50"
            >
              Home <ChevronDown size={14} className="text-gray-400" />
            </Link>
            <Link
              href="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 text-gray-700 font-medium text-sm rounded hover:bg-gray-50"
            >
              Properties <ChevronDown size={14} className="text-gray-400" />
            </Link>

            <div className="h-px bg-gray-100 my-2" />

            {session ? (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="flex items-center gap-2 px-3 py-3 text-red-500 font-bold text-sm w-full"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
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

export default Navbar;