// // components/admin/Sidebar.jsx
// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { ADMIN_NAV_GROUPS } from "@/constants/admin-nav";

// export default function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <div className="w-64 border-r bg-slate-50/50 min-h-screen hidden md:flex flex-col sticky top-0">
//       <div className="p-6">
//         <h1 className="text-xl font-bold text-primary flex items-center gap-2">
//           <span className="bg-primary text-white p-1 rounded">BP</span>
//           Bayut Portal
//         </h1>
//       </div>

//       <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
//         {ADMIN_NAV_GROUPS.map((group) => (
//           <div key={group.label}>
//             <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
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
//                       "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
//                       isActive 
//                         ? "bg-white text-primary shadow-sm border" 
//                         : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
//                     )}
//                   >
//                     <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
//                     {item.title}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </nav>

//       <div className="p-4 border-t text-[10px] text-muted-foreground text-center">
//         v1.0.0 Admin Enterprise
//       </div>
//     </div>
//   );
// }






"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_GROUPS } from "@/constants/admin-nav";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-slate-200 bg-slate-900 min-h-screen hidden md:flex flex-col sticky top-0 z-40">
      {/* Brand Logo Section */}
      <div className="p-8">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="bg-blue-600 text-white h-10 w-10 flex items-center justify-center rounded-xl shadow-lg shadow-blue-900/50 group-hover:scale-105 transition-transform duration-200 font-bold text-xl">
            AP
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white leading-none tracking-tight">
              Admin <span className="text-blue-500">Portal</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Admin Suite
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.label} className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">
              {group.label}
            </h2>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                      isActive 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors", 
                      isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"
                    )} />
                    {item.title}
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Version Info */}
      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter text-center">
            System Version <span className="text-blue-500 ml-1">v1.0.4-Gold</span>
          </p>
        </div>
      </div>
    </div>
  );
}