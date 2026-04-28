// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { signOut } from "next-auth/react";
// import { LogOut } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { ADMIN_NAV_GROUPS } from "@/constants/admin-nav";

// export default function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <div className="w-64 border-r border-slate-200 bg-white min-h-screen hidden md:flex flex-col sticky top-0 z-40">
//       {/* Brand Logo Section */}
//       <div className="p-6 mb-2">
//         <Link href="/admin" className="flex items-center gap-3 group">
//           <div className="relative h-12 w-12 shrink-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group-hover:scale-105 transition-transform duration-200">
//             <Image
//               src="/leadstokey-logo.jpeg"
//               alt="LeadsToKey"
//               fill
//               className="object-contain p-1"
//             />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-base font-bold text-slate-900 leading-none tracking-tight">
//               LeadsTo<span className="text-blue-600">Key</span>
//             </span>
//             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//               Admin Suite
//             </span>
//           </div>
//         </Link>
//       </div>

//       {/* Navigation Groups */}
//       <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
//         {ADMIN_NAV_GROUPS.map((group) => (
//           <div key={group.label} className="animate-in fade-in slide-in-from-left-4 duration-500">
//             <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-4">
//               {group.label}
//             </h2>
//             <div className="space-y-1">
//               {group.items.map((item) => {
//                 const isActive = pathname === item.href;
//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={cn(
//                       "group flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200",
//                       isActive 
//                         ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" 
//                         : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
//                     )}
//                   >
//                     <item.icon className={cn(
//                       "h-4 w-4 transition-colors", 
//                       isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
//                     )} />
//                     {item.title}
//                     {isActive && (
//                       <div className="ml-auto h-1 w-1 rounded-full bg-blue-600" />
//                     )}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </nav>

//       {/* Footer & Logout Section */}
//       <div className="p-4 border-t border-slate-100 space-y-2">
//         <button
//           onClick={() => signOut({ callbackUrl: "/" })}
//           className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
//         >
//           <LogOut className="h-4 w-4 text-rose-400 group-hover:text-rose-500" />
//           Logout Session
//         </button>
//       </div>
//     </div>
//   );
// }



"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_GROUPS } from "@/constants/admin-nav";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white border border-slate-200 rounded-xl shadow-sm md:hidden text-slate-600 hover:text-blue-600"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white min-h-screen flex flex-col transition-transform duration-300 md:sticky md:top-0 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Logo Section */}
        <div className="p-6 mb-2">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 shrink-0">
              <Image
                src="/download.svg"
                alt="LeadsToKey"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 leading-none tracking-tight">
                LeadsTo<span className="text-blue-600">Key</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Admin Suite
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.label} className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-4">
                {group.label}
              </h2>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200",
                        isActive
                          ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                          : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
                        )}
                      />
                      {item.title}
                      {isActive && <div className="ml-auto h-1 w-1 rounded-full bg-blue-600" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer & Logout Section */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
          >
            <LogOut className="h-4 w-4 text-rose-400 group-hover:text-rose-500" />
            Logout Session
          </button>
        </div>
      </div>
    </>
  );
}