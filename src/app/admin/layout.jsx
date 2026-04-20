// app/admin/layout.jsx
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

// app/admin/layout.js
export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Fixed Position */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white">
        <Sidebar />
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}