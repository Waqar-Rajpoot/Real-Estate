"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, ShieldCheck, Lock, ArrowLeft } from "lucide-react";

// 1. Form component (Handles the actual logic)
const ResetPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const username = searchParams.get("username");
  const code = searchParams.get("code");

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    // Basic manual check for password matching
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!username || !code) {
        toast.error("Invalid request. Missing username or verification code.");
        router.replace("/forgot-password");
        return;
      }

      const resetData = {
        username: username,
        code: code,
        newPassword: data.newPassword,
      };

      const response = await axios.post("/api/reset-password", resetData);
      toast.success(response.data.message || "Password reset successfully");
      router.replace("/sign-in");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="••••••••"
                      {...field}
                      className="pl-12 pr-12 h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-600"
                      type={showPassword ? "text" : "password"}
                      required
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-[10px] font-bold uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="••••••••"
                      {...field}
                      className="pl-12 pr-12 h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-600"
                      type={showPassword ? "text" : "password"}
                      required
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-[10px] font-bold uppercase tracking-wider" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.2em] hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-8 pt-8 border-t border-slate-100 text-center">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-slate-500 text-xs font-bold hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Return to <span className="uppercase tracking-widest ml-1">Log In</span>
        </Link>
      </div>
    </div>
  );
};

// 2. Main Page Component
const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
            Security Update
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none text-slate-900">
            Set <span className="text-blue-600">New Pass.</span>
          </h2>
          <p className="text-slate-500 font-medium mt-4 text-sm tracking-wide">
            Ensure your new password is strong and <br className="hidden md:block" />
            contains at least 6 characters.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center p-20 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          LEADS TO KEY SECURED &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;