import AgentNavbar from "@/components/AgentNavbar";

export const metadata = {
  title: "Agent Portal | LeadsToKey",
  description: "Manage your properties and leads on LeadsToKey.",
};

export default function AgentLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Specific Navbar for Agents */}
      <AgentNavbar />

      {/* The pt-20 (padding-top) is crucial because the navbar is 'fixed'. 
        This prevents the dashboard content from being hidden behind the navbar.
      */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      {/* You can add a specific Agent Footer here later if needed */}
    </div>
  );
}