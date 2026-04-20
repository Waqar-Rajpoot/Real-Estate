"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      {/* Consistent Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />

      <div className="max-w-xl w-full text-center z-10">
        {/* Animated Icon Section */}
        <div className="relative flex justify-center mb-8">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-blue-900/5 relative">
            <Building2 className="w-20 h-20 text-blue-600 animate-pulse" />
            <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-lg shadow-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-8xl font-black text-slate-900 tracking-tighter mb-2">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Property Not Found
        </h2>
        <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
          The page you&rsquo;re looking for has moved or no longer exists. 
          Don&rsquo;t worry, we can help you find your way back home.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full sm:w-auto px-8 py-6 rounded-xl text-white border-slate-200 hover:text-slate-900 hover:bg-slate-100 font-semibold transition-all"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>

          <Button
            asChild
            className="w-full sm:w-auto px-8 py-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Footer Links */}
        <div className="mt-12 flex justify-center gap-6 text-sm font-medium text-slate-400">
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Support</Link>
          <span className="select-none">•</span>
          <Link href="/search" className="hover:text-blue-600 transition-colors">Browse Properties</Link>
        </div>
      </div>
    </div>
  );
}