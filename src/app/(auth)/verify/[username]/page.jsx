// "use client"

// import { useState, useEffect } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { toast } from "sonner"
// import axios from "axios";
// import { useParams, useSearchParams, useRouter } from "next/navigation"
// import { ShieldCheck, Loader2, RotateCcw, ArrowRight } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"

// const otpSchema = z.object({
//   otp: z.string().min(6, "OTP must be 6 digits").max(6),
// })

// export default function VerifyOTP() {
//   const [loading, setLoading] = useState(false)
//   const [resending, setResending] = useState(false)
//   const [timer, setTimer] = useState(60)
//   const [attempts, setAttempts] = useState(0)

//   const router = useRouter()
//   const params = useParams()
//   const searchParams = useSearchParams()

//   const username = params.username
//   const emailType = searchParams.get("emailType")

//   useEffect(() => {
//     if (!username) {
//       toast.error("Invalid verification link.")
//       router.push("/register")
//     }
//   }, [username, router])

//   useEffect(() => {
//     let interval
//     if (timer > 0) {
//       interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
//     }
//     return () => clearInterval(interval)
//   }, [timer])

//   const form = useForm({
//     resolver: zodResolver(otpSchema),
//     defaultValues: { otp: "" },
//   })

//   const onVerify = async (values) => {
//     setLoading(true)
//     try {
//       const response = await axios.post("/api/verify-code", {
//         username,
//         emailType,
//         otp: values.otp,
//       })

//       if (response.data.success) {
//         toast.success(response.data.message || "Account verified successfully!")
//         router.push("/login")
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Verification failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleResend = async () => {
//     if (timer > 0 || resending || attempts >= 3) return

//     setResending(true)
//     try {
//       const { data } = await api.post("/users/resend-code", {
//         username,
//         emailType,
//       })

//       if (data.success) {
//         toast.success(data.message || "New OTP sent to your email")
//         setTimer(60)
//         if (data.resendCount !== undefined) {
//           setAttempts(data.resendCount)
//         }
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || "Failed to resend OTP"
//       toast.error(errorMsg)

//       if (error.response?.status === 429) {
//         setAttempts(3)
//       }
//     } finally {
//       setResending(false)
//     }
//   }

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 relative overflow-hidden p-4">
//       <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/50 blur-[120px] rounded-full" />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full" />

//       <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-blue-900/5 z-10">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
//               <ShieldCheck className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//             Verify Your Account
//           </h1>
//           <p className="text-slate-500 mt-2 text-sm leading-relaxed">
//             Hi <span className="text-slate-900 font-bold">@{username}</span>,{" "}
//             <br />
//             Enter the 6-digit code sent to your email.
//           </p>
//           {emailType === "VERIFY" && (
//             <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
//               Standard Verification
//             </span>
//           )}
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onVerify)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="otp"
//               render={({ field }) => (
//                 <FormItem className="space-y-2">
//                   <FormLabel className="text-sm font-bold text-slate-700 ml-1">
//                     Enter OTP Code
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       className="text-center text-3xl font-bold tracking-[0.4em] h-16 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all"
//                       placeholder="000000"
//                       maxLength={6}
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-500 font-medium text-xs" />
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 py-7 text-white rounded-xl shadow-lg shadow-blue-200 font-bold text-lg group transition-all active:scale-[0.98]"
//             >
//               {loading ? (
//                 <div className="flex items-center gap-2">
//                   <Loader2 className="animate-spin w-5 h-5" /> Verifying...
//                 </div>
//               ) : (
//                 <span className="flex items-center gap-2">
//                   Verify Account{" "}
//                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </span>
//               )}
//             </Button>
//           </form>
//         </Form>

//         <div className="mt-10 text-center border-t border-slate-100 pt-8">
//           <p className="text-slate-500 text-sm mb-3 font-medium">
//             Didn&apos;t receive the code?
//           </p>

//           <div className="flex flex-col items-center gap-2">
//             <Button
//               type="button"
//               variant="ghost"
//               onClick={handleResend}
//               disabled={timer > 0 || resending || attempts >= 3}
//               className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold transition-all"
//             >
//               {resending ? (
//                 <Loader2 className="w-4 h-4 animate-spin mr-2" />
//               ) : (
//                 <RotateCcw className="w-4 h-4 mr-2" />
//               )}
//               {timer > 0
//                 ? `Resend in ${timer}s`
//                 : attempts >= 3
//                 ? "Resend Limit Reached"
//                 : "Resend OTP"}
//             </Button>

//             <p
//               className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
//                 attempts >= 2 ? "text-red-500" : "text-slate-400"
//               }`}
//             >
//               {attempts >= 3
//                 ? "Account Locked"
//                 : `${3 - attempts} Attempts Remaining`}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }








"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import axios from "axios" // Standard axios
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { ShieldCheck, Loader2, RotateCcw, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
})

export default function VerifyOTP() {
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timer, setTimer] = useState(60)
  const [attempts, setAttempts] = useState(0)

  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const username = params.username
  const emailType = searchParams.get("emailType") || "VERIFY"

  // Redirect if no username is present
  useEffect(() => {
    if (!username) {
      toast.error("Invalid verification link.")
      router.push("/register")
    }
  }, [username, router])

  // Countdown Timer Logic
  useEffect(() => {
    let interval
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  // 1. VERIFY CODE LOGIC
  const onVerify = async (values) => {
    setLoading(true)
    try {
      // Ensure the URL matches your Next.js API route folder structure
      const response = await axios.post("/api/verify-code", {
        username,
        emailType,
        otp: values.otp,
      })

      if (response.data.success) {
        toast.success(response.data.message || "Verified successfully!")
        router.push("/sign-in")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP")
    } finally {
      setLoading(false)
    }
  }

  // 2. RESEND CODE LOGIC
  const handleResend = async () => {
    // Prevent resending if timer is active or limit reached
    if (timer > 0 || resending || attempts >= 3) return

    setResending(true)
    try {
      // Unifying 'api.post' to 'axios.post' to match the rest of the file
      const { data } = await axios.post("/api/resend-code", {
        username,
        emailType,
      })

      if (data.success) {
        toast.success("A new code has been sent to your email.")
        setTimer(60)
        setAttempts((prev) => prev + 1) // Increment local attempt count
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to resend OTP"
      toast.error(errorMsg)

      if (error.response?.status === 429) {
        setAttempts(3) // Lock UI if backend says rate limit exceeded
      }
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-blue-900/5 z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Verify Your Account
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Hi <span className="text-slate-900 font-bold">@{username}</span>, <br />
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onVerify)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold text-slate-700 ml-1">
                    Enter OTP Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      className="text-center text-3xl font-bold tracking-[0.4em] h-16 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 font-medium text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-7 text-white rounded-xl shadow-lg shadow-blue-200 font-bold text-lg group transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" /> Verifying...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Verify Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-10 text-center border-t border-slate-100 pt-8">
          <p className="text-slate-500 text-sm mb-3 font-medium">Didn&apos;t receive the code?</p>

          <div className="flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={timer > 0 || resending || attempts >= 3}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold transition-all"
            >
              {resending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              {timer > 0 ? `Resend in ${timer}s` : attempts >= 3 ? "Resend Limit Reached" : "Resend OTP"}
            </Button>

            <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${attempts >= 2 ? "text-red-500" : "text-slate-400"}`}>
              {attempts >= 3 ? "Account Locked" : `${3 - attempts} Attempts Remaining`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}