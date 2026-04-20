"use client";
import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  Lock,
  Search,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-indigo-100">
      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Lock className="text-white h-5 w-5" />
          </div>
          <span>LEADS TO <span className="text-indigo-600">KEY</span></span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="font-bold text-slate-600 hover:text-indigo-600">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="rounded-full bg-slate-900 hover:bg-slate-800 font-bold px-6">
              Join as Agency
            </Button>
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.2em]">Pre-Launch Phase 1.0</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.85]">
              Unlocking <span className="text-indigo-600">Trust</span> In Real Estate.
            </h1>

            <div className="space-y-4">
              <p className="text-lg text-slate-600 font-medium leading-relaxed border-l-4 border-indigo-600 pl-6">
                At <span className="text-slate-900 font-bold">Leads to Key</span>, we are redefining the landscape of the Pakistani property market. We are building more than just a marketplace; we are creating an <span className="text-indigo-600 underline decoration-2 underline-offset-4">ecosystem of authenticity.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/sign-up">
                <Button className="h-16 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-black shadow-2xl shadow-indigo-200 group transition-all">
                  Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-slate-200 bg-white hover:bg-slate-50">
                View Mission
              </Button>
            </div>

            {/* Trust Metrics */}
            <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
              <div>
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Listings</p>
              </div>
              <div className="h-8 w-[1px] bg-slate-200" />
              <div>
                <p className="text-2xl font-black text-slate-900">Vetted</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agent Network</p>
              </div>
            </div>
          </div>

          {/* --- Premium Visual Element --- */}
          <div className="relative animate-in zoom-in duration-1000">
            <div className="relative z-10 aspect-[4/5] bg-slate-900 rounded-[4rem] overflow-hidden shadow-3xl transform hover:rotate-0 transition-transform duration-500 rotate-2 border-[12px] border-white">
              {/* Visual Placeholder: Abstract Gradient & Grid */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-transparent to-transparent" />

              <div className="absolute bottom-12 left-12 right-12 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-indigo-400" />
                  <span className="font-bold tracking-widest uppercase text-xs">Pakistan Real Estate</span>
                </div>
                <h3 className="text-3xl font-black leading-tight">Secure. Transparent. Authenticated.</h3>
              </div>
            </div>

            {/* Floating UI Elements */}
            <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Zero Fraud</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Listing Protocol</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Mission Detail Section --- */}
      <section className="bg-slate-900 py-32 px-6 md:px-12 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Our mission is to bridge the gap between ambition and ownership.</h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              By strictly verifying every listing and vetting every registered agent, we eliminate the uncertainty that has historically shadowed the industry. Connect with absolute confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="h-8 w-8 text-indigo-400" />}
              title="Verified Listings"
              desc="We manually audit every property entry to ensure what you see is what exists."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-indigo-400" />}
              title="Vetted Agents"
              desc="Only professionals with proven track records and verified credentials can join."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-8 w-8 text-indigo-400" />}
              title="Absolute Confidence"
              desc="A platform where homeowners, investors, and developers connect securely."
            />
          </div>
        </div>

        {/* Abstract Background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[120px] -z-0" />
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
          © 2026 Leads to Key — Redefining Authenticity
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group space-y-6 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="p-4 bg-indigo-500/10 w-fit rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <p className="text-slate-400 font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
}