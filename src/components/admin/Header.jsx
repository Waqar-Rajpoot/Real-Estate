// // components/admin/Header.jsx
// import { Search, Bell, UserCircle } from "lucide-react";
// import { Input } from "@/components/ui/input";

// export default function Header() {
//   return (
//     <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
//       {/* Left: Search Bar */}
//       <div className="relative w-96">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search properties, agencies, or IDs..."
//           className="pl-10 bg-slate-50 border-none focus-visible:ring-1"
//         />
//       </div>

//       {/* Right: Actions & Status */}
//       <div className="flex items-center gap-6">
//         <div className="flex items-center gap-2">
//           <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
//           <span className="text-xs font-medium text-muted-foreground">
//             System Live
//           </span>
//         </div>

//         <button className="relative text-muted-foreground hover:text-primary transition-colors">
//           <Bell className="h-5 w-5" />
//           <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
//         </button>

//         <div className="flex items-center gap-3 border-l pl-6">
//           <div className="text-right">
//             <p className="text-sm font-bold leading-none">Super Admin</p>
//             <p className="text-[10px] text-muted-foreground">Administrator</p>
//           </div>
//           <UserCircle className="h-8 w-8 text-slate-300" />
//         </div>
//       </div>
//     </header>
//   );
// }






// components/admin/Header.jsx
import { Search, Bell, UserCircle, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      
      {/* Left Section: Search with Improved Contrast */}
      <div className="relative w-full max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <Input
          placeholder="Search by ID, Agency or Agent name..."
          className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all rounded-lg"
        />
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-5">
        
        {/* System Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Server: Operational
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 border-r border-slate-200 pr-5">
          <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-blue-600 rounded-full border-2 border-white" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Admin Profile Section */}
        <div className="flex items-center gap-3 pl-1 group cursor-pointer">
          <div className="text-right flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Super Admin
            </p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">
              Main Office
            </p>
          </div>
          
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-200 ring-2 ring-white overflow-hidden group-hover:scale-105 transition-transform">
             <UserCircle className="h-7 w-7 opacity-90" />
          </div>
        </div>
      </div>
    </header>
  );
}