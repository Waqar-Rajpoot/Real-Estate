





"use client";

import { MessageCircle } from "lucide-react";
import { generateWhatsAppLeadURL } from "@/lib/whatsapp";

export default function RegisterInterestButton({ property, variant = "detail" }) {
  const isCard = variant === "card";

  async function logLead() {
    try {
      // Fire and forget
      fetch("/api/leads/whatsapp-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property._id,
          agentId: property.agent || null,
          agencyId: property.agency || null,
          source: isCard ? "LandingPageCard" : "PropertyDetail",
        }),
      });
    } catch {
      // Silent fail
    }
  }

  function handleClick(e) {
    // CRITICAL: Stop the parent <Link> from firing on the landing page
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    logLead();

    const url = generateWhatsAppLeadURL(property);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={`flex flex-col ${isCard ? "gap-0" : "gap-2"}`}>
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 w-full
                   bg-green-600 hover:bg-green-700 active:bg-green-800
                   text-white transition-all duration-200 shadow-md 
                   ${isCard 
                     ? "py-2 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider" 
                     : "py-3 px-6 rounded-xl text-base font-semibold"
                   }`}
      >
        <MessageCircle className={isCard ? "w-4 h-4" : "w-5 h-5"} />
        {isCard ? "WhatsApp Inquiry" : "Register Interest via WhatsApp"}
      </button>

      {!isCard && (
        <p className="text-xs text-center text-gray-500">
          You will be connected with our team who will assist you with this property.
        </p>
      )}
    </div>
  );
}