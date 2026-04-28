"use client";

import React from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Users, 
  Eye, 
  Gavel, 
  TrendingUp, 
  CheckCircle2,
  Lock,
  Search
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative bg-[#0b1c3c] py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
            Establishing a New Standard
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight italic">
            Unlocking Trust in <br />
            <span className="text-blue-500">Pakistani Real Estate</span>
          </h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-lg font-medium leading-relaxed">
            We are redefining the landscape of the property market. Currently in our pre-launch phase, 
            we are building an ecosystem where authenticity is the baseline, not the exception.
          </p>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 transform translate-x-1/2" />
      </section>

      {/* ── MISSION & VISION ────────────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              LeadsToKey was born from a simple observation: the Pakistani real estate industry 
              needed a bridge between ambition and ownership. Historically, uncertainty has 
              shadowed the industry. We are here to eliminate that shadow.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                <Eye className="text-blue-600 w-8 h-8 mb-4" />
                <h4 className="font-black text-gray-900 mb-2">Transparency</h4>
                <p className="text-sm text-gray-500">Clear pricing and verified historical data for every plot and home.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                <Lock className="text-blue-600 w-8 h-8 mb-4" />
                <h4 className="font-black text-gray-900 mb-2">Security</h4>
                <p className="text-sm text-gray-500">Advanced vetting protocols for every registered agent and agency.</p>
              </div>
            </div>
          </div>
          <div className="relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl">
             <Image 
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1296&auto=format&fit=crop" 
                alt="Modern Architecture" 
                fill 
                className="object-cover"
             />
          </div>
        </div>
      </section>

      {/* ── THE TRUST PROTOCOL (Security & Legal) ───────────────────────── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
              The LeadsToKey Trust Protocol
            </h2>
            <p className="text-gray-500 font-bold max-w-2xl mx-auto">
              We don&rsquo;t just list properties; we protect your investment through 
              rigorous legal and technical verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Verification */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="font-black text-xl mb-4 text-gray-900">TruCheck™ Listings</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Every listing on our platform undergoes a multi-layer verification process. 
                We confirm the availability and price directly with the listing party to prevent &quot;ghost listings.&quot;
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-xs font-black text-gray-700 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> Document Verification
                </li>
                <li className="flex items-center text-xs font-black text-gray-700 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> Recent Site Visit
                </li>
              </ul>
            </div>

            {/* Legal Action */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Gavel className="text-red-600 w-8 h-8" />
              </div>
              <h3 className="font-black text-xl mb-4 text-gray-900">Zero Tolerance Policy</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Integrity is non-negotiable. We take strict legal action against any violation, 
                misleading information, or unethical practices on our platform.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-xs font-black text-gray-700 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-red-500 mr-2" /> Instant De-listing
                </li>
                <li className="flex items-center text-xs font-black text-gray-700 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-red-500 mr-2" /> Legal Blacklisting
                </li>
              </ul>
            </div>

            {/* Agent Vetting */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <Users className="text-green-600 w-8 h-8" />
              </div>
              <h3 className="font-black text-xl mb-4 text-gray-900">Expert Vetting</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                We bridge the gap between ambition and ownership by ensuring only the 
                most reputable developers and agencies are registered on our platform.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-xs font-black text-gray-700 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" /> Reputation Scoring
                </li>
                <li className="flex items-center text-xs font-black text-gray-700 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" /> Performance Tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES / NUMBERS ────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#0b1c3c] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-4xl font-black mb-2 text-blue-500 italic">100%</p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Vetted Listings</p>
          </div>
          <div>
            <p className="text-4xl font-black mb-2 text-blue-500 italic">SECURE</p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Legal Framework</p>
          </div>
          <div>
            <p className="text-4xl font-black mb-2 text-blue-500 italic">24/7</p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Fraud Monitoring</p>
          </div>
          <div>
            <p className="text-4xl font-black mb-2 text-blue-500 italic">LEAD</p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Market Authority</p>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ──────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-blue-800 rounded-[4rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 italic uppercase tracking-tighter">
              Ready to find your <br /> next investment?
            </h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl">
                Explore Properties
              </button>
              <button className="bg-blue-500/20 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-colors">
                Register as Agent
              </button>
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full" />
        </div>
      </section>
    </div>
  );
}