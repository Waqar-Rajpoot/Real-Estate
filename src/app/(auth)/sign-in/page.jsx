// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginZodSchema } from "@/Schemas/user.schema"; // Ensure this path is correct
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { signIn } from "next-auth/react";
// import {
//   Building2,
//   Mail,
//   Lock,
//   Loader2,
//   ArrowRight,
//   Eye,
//   EyeOff,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// export default function Login() {
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   const form = useForm({
//     resolver: zodResolver(loginZodSchema),
//     defaultValues: {
//       identifier: "",
//       password: "",
//     },
//   });

//   async function onSubmit(values) {
//     setLoading(true);
//     try {
//       // NextAuth handles the request to your [...nextauth] route
//       const result = await signIn("credentials", {
//         redirect: false,
//         identifier: values.identifier,
//         password: values.password,
//       });

//       if (result?.error) {
//         toast.error(result.error || "Login failed");
//         return;
//       }

//       if (result?.ok) {
//         toast.success("Welcome back!");
        
//         // NextAuth doesn't return the full user object here for security.
//         // Usually, you'd fetch the session or handle redirection in middleware.
//         // However, for immediate redirection, you can trigger a refresh 
//         // or redirect to a landing dashboard that handles role-checks.
//         router.push("/dashboard");
//         router.refresh(); 
//       }
//     } catch (error) {
//         console.error("Login error:", error);
//       toast.error("An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
//       <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 blur-[120px] rounded-full" />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />

//       <div className="w-full max-w-md bg-white border border-slate-300 rounded-3xl p-8 shadow-xl shadow-blue-900/5 z-10">
//         <div className="text-center mb-10">
//           <div className="flex justify-center mb-4">
//             <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
//               <Building2 className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//             Welcome Back
//           </h1>
//           <p className="text-slate-500 mt-2 font-medium">
//             Sign in to your premium portal
//           </p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="identifier"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-slate-700 font-semibold">
//                     Email or Username
//                   </FormLabel>
//                   <FormControl>
//                     <div className="relative group">
//                       <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
//                       <Input
//                         placeholder="Enter email or username"
//                         {...field}
//                         className="pl-10 h-12 bg-slate-50 text-slate-900 border-slate-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all"
//                       />
//                     </div>
//                   </FormControl>
//                   <FormMessage className="text-red-500" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <div className="flex justify-between items-center">
//                     <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
//                     <Link
//                       href="/forgot-password"
//                       className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
//                     >
//                       Forgot Password?
//                     </Link>
//                   </div>
//                   <FormControl>
//                     <div className="relative group">
//                       <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
//                       <Input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="••••••••"
//                         {...field}
//                         className="pl-10 h-12 bg-slate-50 text-slate-900 border-slate-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-3 text-slate-400 hover:text-blue-600 transition-colors"
//                       >
//                         {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                       </button>
//                     </div>
//                   </FormControl>
//                   <FormMessage className="text-red-500" />
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-7 rounded-xl transition-all shadow-lg shadow-blue-200 text-lg active:scale-[0.98] group"
//             >
//               {loading ? (
//                 <div className="flex items-center gap-2">
//                   <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center">
//                   Sign In
//                   <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//                 </div>
//               )}
//             </Button>
//           </form>
//         </Form>

//         <div className="mt-8 text-center text-slate-600 font-medium">
//           New to the platform?{" "}
//           <Link
//             href="/register"
//             className="text-blue-600 hover:text-blue-800 font-bold underline underline-offset-4 decoration-2"
//           >
//             Create Account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }







// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginZodSchema } from "@/Schemas/user.schema"; 
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { signIn } from "next-auth/react";
// import axios from "axios";
// import {
//   Building2,
//   Mail,
//   Lock,
//   Loader2,
//   ArrowRight,
//   Eye,
//   EyeOff,
//   ShieldCheck,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// export default function Login() {
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showOTP, setShowOTP] = useState(false); // 2FA Toggle
//   const [otpValue, setOtpValue] = useState(""); // OTP State
//   const router = useRouter();

//   const form = useForm({
//     resolver: zodResolver(loginZodSchema),
//     defaultValues: {
//       identifier: "",
//       password: "",
//     },
//   });

//   async function onSubmit(values) {
//     setLoading(true);
//     try {
//       if (!showOTP) {
//         // --- STAGE 1: Check Credentials & Trigger 2FA ---
//         const response = await axios.post("/api/auth/send-2fa", {
//           identifier: values.identifier,
//           password: values.password,
//         });

//         if (response.data.requires2FA) {
//           setShowOTP(true);
//           toast.success("Security code sent to your email");
//           setLoading(false);
//           return;
//         }
//       }

//       // --- STAGE 2: Final Login Handshake ---
//       const result = await signIn("credentials", {
//         redirect: false,
//         identifier: values.identifier,
//         password: values.password,
//         code: otpValue, // Passed to NextAuth authorize function
//       });

//       if (result?.error) {
//         toast.error(result.error || "Login failed");
//         setLoading(false);
//         return;
//       }

//       if (result?.ok) {
//         toast.success("Welcome back!");
//         router.push("/dashboard");
//         router.refresh();
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || "An unexpected error occurred";
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
//       {/* Background Decor */}
//       <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 blur-[120px] rounded-full" />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />

//       <div className="w-full max-w-md bg-white border border-slate-300 rounded-3xl p-8 shadow-xl shadow-blue-900/5 z-10">
//         <div className="text-center mb-10">
//           <div className="flex justify-center mb-4">
//             <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
//               <Building2 className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//             {showOTP ? "Verify Identity" : "Welcome Back"}
//           </h1>
//           <p className="text-slate-500 mt-2 font-medium text-sm">
//             {showOTP 
//               ? "Enter the 6-digit code sent to your email" 
//               : "Sign in to your premium portal"}
//           </p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {!showOTP ? (
//               <>
//                 <FormField
//                   control={form.control}
//                   name="identifier"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Email or Username</FormLabel>
//                       <FormControl>
//                         <div className="relative group">
//                           <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
//                           <Input
//                             placeholder="Enter credentials"
//                             {...field}
//                             className="pl-10 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-500 border-slate-300 rounded-xl transition-all"
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <div className="flex justify-between items-center">
//                         <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Password</FormLabel>
//                         <Link href="/forgot-password" size="xs" className="text-xs font-bold text-blue-600 hover:underline">
//                           Forgot?
//                         </Link>
//                       </div>
//                       <FormControl>
//                         <div className="relative group">
//                           <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
//                           <Input
//                             type={showPassword ? "text" : "password"}
//                             placeholder="••••••••"
//                             {...field}
//                             className="pl-10 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-500 border-slate-300 rounded-xl transition-all"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute right-3 top-3 text-slate-400 hover:text-blue-600"
//                           >
//                             {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                           </button>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </>
//             ) : (
//               /* OTP INPUT AREA */
//               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
//                 <FormItem>
//                   <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Verification Code</FormLabel>
//                   <div className="relative">
//                     <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-blue-600" />
//                     <Input
//                       maxLength={6}
//                       placeholder="000000"
//                       value={otpValue}
//                       onChange={(e) => setOtpValue(e.target.value)}
//                       className="pl-10 h-14 bg-blue-50/50 border-blue-200 text-center text-2xl font-bold tracking-[0.5em] rounded-xl focus:ring-blue-500"
//                     />
//                   </div>
//                   <button 
//                     type="button" 
//                     onClick={() => setShowOTP(false)}
//                     className="text-[10px] font-bold text-blue-600 uppercase mt-2 hover:underline"
//                   >
//                     ← Back to credentials
//                   </button>
//                 </FormItem>
//               </div>
//             )}

//             <Button
//               type="submit"
//               disabled={loading || (showOTP && otpValue.length < 6)}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-7 rounded-xl transition-all shadow-lg text-lg active:scale-[0.98] group"
//             >
//               {loading ? (
//                 <div className="flex items-center gap-2">
//                   <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center">
//                   {showOTP ? "Verify & Enter" : "Sign In"}
//                   <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//                 </div>
//               )}
//             </Button>
//           </form>
//         </Form>

//         <div className="mt-8 text-center text-slate-600 font-medium">
//           New to the platform?{" "}
//           <Link href="/register" className="text-blue-600 hover:text-blue-800 font-bold underline decoration-2">
//             Create Account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginZodSchema } from "@/Schemas/user.schema"; 
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Building2,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
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

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginZodSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      // Direct sign-in with credentials
      const result = await signIn("credentials", {
        redirect: false,
        identifier: values.identifier,
        password: values.password,
      });

      if (result?.error) {
        toast.error(result.error || "Login failed");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("Welcome back!");
        router.push("/agency/agency-register");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />

      <div className="w-full max-w-md bg-white border border-slate-300 rounded-3xl p-8 shadow-xl shadow-blue-900/5 z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">
            Sign in to your premium portal
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wider">
                    Email or Username
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        placeholder="Enter credentials"
                        {...field}
                        className="pl-10 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-500 border-slate-300 rounded-xl transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wider">
                      Password
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="pl-10 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-500 border-slate-300 rounded-xl transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-7 rounded-xl transition-all shadow-lg text-lg active:scale-[0.98] group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center text-slate-600 font-medium">
          New to the platform?{" "}
          <Link
            href="/sign-up"
            className="text-blue-600 hover:text-blue-800 font-bold underline decoration-2"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}