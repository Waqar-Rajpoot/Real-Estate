"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

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
import { Loader2, Mail, ArrowLeft, Send } from "lucide-react";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/api/forgot-password", {
        email: data.email,
      });

      toast.success(response.data.message);
      const { username, emailType } = response.data;
      
      // Navigate to verify page with dynamic params
      router.replace(`/verify/${username}?emailType=${emailType}`);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      console.error("Forgot password error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Soft Light Theme Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        {/* Header Section - Matches LeadsToKey Branding */}
        <div className="text-center mb-8">
          <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
            Account Recovery
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none text-slate-900">
            Forgot <span className="text-blue-600">Password?</span>
          </h2>
          <p className="text-slate-500 font-medium mt-4 text-sm tracking-wide leading-relaxed">
            No worries! Enter your email and we&apos;ll send a <br className="hidden md:block" /> 
            secure recovery link to your inbox.
          </p>
        </div>

        {/* Professional White Card */}
        <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="name@email.com"
                          {...field}
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-600 transition-all"
                          required
                          type="email"
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
                  <span className="flex items-center gap-2">
                    Send Link <Send size={16} />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-slate-500 text-xs font-bold hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to <span className="uppercase tracking-widest ml-1">Log In</span>
            </Link>
          </div>
        </div>

        {/* Brand Footer */}
        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          LEADS TO KEY &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;