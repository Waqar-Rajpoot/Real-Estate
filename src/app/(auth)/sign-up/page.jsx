"use client"; // Mandatory for hooks in Next.js

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerZodSchema } from "@/Schemas/user.schema"; 
import axios from "axios"; // Using standard axios for simplicity
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Next.js routing
import Link from "next/link"; // Next.js link component
import { 
  Building2, User, Mail, Lock, Phone, Loader2, Eye, 
  EyeOff, ShieldCheck, Briefcase 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Replacing useNavigate

  const form = useForm({
    resolver: zodResolver(registerZodSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Buyer",
      phoneNumber: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      // Logic: Backend handles the rest based on our mongoose model
      const { confirmPassword: _, ...registerData } = values;
      
      // Update the URL to your Next.js API route
      const response = await axios.post("/api/register", registerData);

      if (response.data.success) {
        toast.success("Account created! Please check your email for the OTP.");
      const emailType = "VERIFY";
      router.replace(`/verify/${values.username}?emailType=${emailType}`);
      
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      {/* Soft Blue Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />

      <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-3xl p-8 shadow-xl shadow-blue-900/5 z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Join the most trusted real estate network
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          className="pl-10 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-slate-400 text-sm font-bold">@</span>
                        <Input
                          placeholder="Enter a unique username"
                          {...field}
                          className="pl-10 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="dev@example.com"
                          {...field}
                          className="pl-10 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="tel"
                          placeholder="+92 300 0000000"
                          {...field}
                          className="pl-10 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-blue-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Account Type */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel  className="text-slate-700 font-semibold">I want to register as a...</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 border-slate-300 rounded-xl focus:ring-blue-500">
                        <SelectValue placeholder="Select Account Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Buyer">
                        <div className="flex items-center text-slate-500">
                          <User className="mr-2 h-4 w-4 text-blue-500" /> 
                          Buyer (Looking for property)
                        </div>
                      </SelectItem>
                      <SelectItem value="Agency">
                        <div className="flex items-center text-slate-500">
                          <Briefcase className="mr-2 h-4 w-4 text-blue-500" /> 
                          Agency (Business/Company)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-7 rounded-xl transition-all shadow-lg shadow-blue-200 text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Creating Account...
                </div>
              ) : (
                "Get Started"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center text-slate-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-blue-600 hover:text-blue-800 font-bold underline underline-offset-4"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}