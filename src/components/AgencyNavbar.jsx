// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { 
//   UserCircle, 
//   UserPlus, 
//   Users, 
//   LayoutDashboard, 
//   Menu, 
//   X,
//   ChevronRight
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils"; // Standard shadcn utility

// const AgencyNavbar = () => {
//   const pathname = usePathname();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const navLinks = [
//     {
//       name: "Dashboard",
//       href: "/agency/dashboard",
//       icon: <LayoutDashboard size={18} />,
//     },
//     {
//       name: "My Agents",
//       href: "/agency/agents",
//       icon: <Users size={18} />,
//     },
//     {
//       name: "Add Agent",
//       href: "/agency/add-agent",
//       icon: <UserPlus size={18} />,
//     },
//     {
//       name: "Agency Profile",
//       href: "/agency/profile",
//       icon: <UserCircle size={18} />,
//     },
//   ];

//   return (
//     <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
          
//           {/* Logo Section */}
//           <div className="flex items-center gap-2">
//             <div className="bg-blue-600 p-1.5 rounded-lg">
//               <div className="w-6 h-6 border-2 border-white rounded-sm rotate-45" />
//             </div>
//             <span className="text-xl font-bold text-slate-900 tracking-tight">
//               Agency<span className="text-blue-600">Portal</span>
//             </span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-1">
//             {navLinks.map((link) => {
//               const isActive = pathname === link.href;
//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={cn(
//                     "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
//                     isActive 
//                       ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100" 
//                       : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                   )}
//                 >
//                   {link.icon}
//                   {link.name}
//                 </Link>
//               );
//             })}
//           </div>

//           {/* User Section (Optional logout button or avatar could go here) */}
//           <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-200">
//              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600">
//                Logout
//              </Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
//             >
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top duration-300">
//           <div className="px-4 py-6 space-y-2">
//             {navLinks.map((link) => {
//               const isActive = pathname === link.href;
//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className={cn(
//                     "flex items-center justify-between p-4 rounded-xl text-base font-semibold transition-colors",
//                     isActive 
//                       ? "bg-blue-600 text-white" 
//                       : "bg-slate-50 text-slate-700 hover:bg-slate-100"
//                   )}
//                 >
//                   <div className="flex items-center gap-3">
//                     {link.icon}
//                     {link.name}
//                   </div>
//                   <ChevronRight size={16} className={isActive ? "text-blue-200" : "text-slate-400"} />
//                 </Link>
//               );
//             })}
//             <div className="pt-4 mt-4 border-t border-slate-100">
//                <Button className="w-full justify-start gap-3 bg-transparent text-red-500 hover:bg-red-50 hover:text-red-600 shadow-none border-none">
//                  Logout
//                </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default AgencyNavbar;







"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // Functional logout
import { 
  UserCircle, 
  UserPlus, 
  Users, 
  LayoutDashboard, 
  Menu, 
  X,
  ChevronRight,
  LogOut,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AgencyNavbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/agency/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "My Agents",
      href: "/agency/agents",
      icon: <Users size={18} />,
    },
    {
      name: "Add Agent",
      href: "/agency/add-agent",
      icon: <UserPlus size={18} />,
    },
    {
      name: "Agency Profile",
      href: "/agency/profile",
      icon: <UserCircle size={18} />,
    },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/sign-in" }); // Redirects to login after logout
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO SECTION */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
              <div className="absolute inset-0 bg-white opacity-10 rounded-xl rotate-12 scale-110" />
              <div className="w-5 h-5 border-2 border-white rounded-[4px] rotate-45" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                Agency<span className="text-blue-600 italic">Portal</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Management</span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
                    isActive 
                      ? "text-blue-600 bg-blue-50/50" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <span className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-blue-600" : "text-slate-400"
                  )}>
                    {link.icon}
                  </span>
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ACTION BUTTONS (Logout & Notifications) */}
          <div className="hidden md:flex items-center gap-3 pl-6 border-l border-slate-200">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-full">
              <Bell size={20} />
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              className="group flex items-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-bold"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              Sign Out
            </Button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2 rounded-xl transition-all",
                isMobileMenuOpen ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 w-full bg-white border-b border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-8 space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-[20px] text-base font-black transition-all",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]" 
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {link.icon}
                    {link.name}
                  </div>
                  <ChevronRight size={18} className={isActive ? "text-blue-200" : "text-slate-300"} />
                </Link>
              );
            })}
            
            <div className="pt-6 mt-6 border-t border-slate-100">
               <Button 
                 onClick={handleLogout}
                 className="w-full h-14 justify-center gap-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-[20px] shadow-none border-none font-black transition-all"
               >
                 <LogOut size={20} />
                 Confirm Sign Out
               </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AgencyNavbar;