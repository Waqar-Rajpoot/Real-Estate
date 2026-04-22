"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agencySchema } from "@/lib/agencySchema";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/common/FileUpload"; 
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Building2,
  ShieldCheck,
  MapPin,
  FileCheck,
} from "lucide-react";

const StepIndicator = ({ step }) => (
  <div className="flex items-center justify-between max-w-md mx-auto mb-12 relative">
    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
    {[1, 2, 3, 4].map((num) => (
      <div key={num} className="relative z-10 flex flex-col items-center">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full border-4 transition-all duration-300 ${
            step >= num
              ? "bg-blue-600 border-white text-white shadow-lg"
              : "bg-white border-gray-200 text-gray-400"
          }`}
        >
          {step > num ? <CheckCircle2 size={18} /> : num}
        </div>
        <span
          className={`text-[10px] uppercase tracking-wider mt-2 font-bold ${
            step >= num ? "text-blue-700" : "text-gray-400"
          }`}
        >
          Step {num}
        </span>
      </div>
    ))}
  </div>
);
const ErrorMessage = ({ message }) =>
  message ? (
    <p className="text-[11px] text-red-500 font-medium mt-1 animate-in fade-in slide-in-from-top-1">
      {message}
    </p>
  ) : null;


export default function AgencyRegister() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { data: session, update } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(agencySchema),
    mode: "onChange",
  });

  const handleNext = async (fields) => {
    const isValid = await trigger(fields);
    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      toast.error("Please fix the errors before continuing.");
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/agency/register", data);

      if (response.data.success) {
        await update();
        toast.success("Agency Registered Successfully!");
        router.push("/agency/profile");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error(err.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-[#0b1c3c] py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Partner With Houzing
        </h1>
        <p className="text-blue-200 max-w-lg mx-auto text-sm opacity-90">
          Complete your agency profile to start listing properties today.
        </p>
      </div>

      <div className="max-w-4xl mx-auto -mt-10 px-4 w-full pb-20">
        <Card className="border-none shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="bg-white p-8 border-b border-slate-100">
            <StepIndicator step={step} />
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl mb-4 text-blue-600">
                {step === 1 && <Building2 size={24} />}
                {step === 2 && <MapPin size={24} />}
                {step === 3 && <ShieldCheck size={24} />}
                {step === 4 && <FileCheck size={24} />}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {step === 1 && "Basic Information"}
                {step === 2 && "Agency Branding"}
                {step === 3 && "Identity Verification"}
                {step === 4 && "Documents & WhatsApp"}
              </h2>
            </div>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">
                        Company Name
                      </Label>
                      <Input
                        {...register("companyName")}
                        className={`bg-slate-100 h-12 ${errors.companyName ? "border-red-500" : "border-slate-300"} placeholder-gray-400 text-black`}
                        placeholder="e.g. Royal Estates"
                      />
                      <ErrorMessage message={errors.companyName?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">
                        License Number
                      </Label>
                      <Input
                        {...register("licenseNumber")}
                        className={`bg-slate-100 h-12 ${errors.licenseNumber ? "border-red-500" : "border-slate-300"} placeholder-gray-400 text-black`}
                        placeholder="REQ-12345"
                      />
                      <ErrorMessage message={errors.licenseNumber?.message} />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 h-12 text-md font-semibold mt-4"
                    onClick={() => handleNext(["companyName", "licenseNumber"])}
                  >
                    Continue <ChevronRight className="ml-2" size={18} />
                  </Button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-8 duration-500">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">
                        Operating City
                      </Label>
                      <Input
                        {...register("city")}
                        className={`bg-slate-100 h-12 ${errors.city ? "border-red-500" : "border-slate-300"} placeholder-gray-400 text-black`}
                        placeholder="Lahore"
                      />
                      <ErrorMessage message={errors.city?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">
                        Year Established
                      </Label>
                      <Input
                        type="number"
                        {...register("yearEstablished")}
                        className={`bg-slate-100 h-12 ${errors.yearEstablished ? "border-red-500" : "border-slate-300"} placeholder-gray-400 text-black`}
                        placeholder="2024"
                      />
                      <ErrorMessage message={errors.yearEstablished?.message} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">
                      Full Office Address
                    </Label>
                    <Input
                      {...register("officeAddress")}
                      className={`bg-slate-100 h-12 ${errors.officeAddress ? "border-red-500" : "border-slate-300"} placeholder-gray-400 text-black`}
                      placeholder="Main Boulevard"
                    />
                    <ErrorMessage message={errors.officeAddress?.message} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">
                      Agency Bio
                    </Label>
                    <Textarea
                      {...register("companyBio")}
                      className={`bg-slate-100 min-h-25 ${errors.companyBio ? "border-red-500" : "border-slate-300"} placeholder-gray-400 text-black`}
                      placeholder="Tell us about your agency..."
                    />
                    <ErrorMessage message={errors.companyBio?.message} />
                  </div>

                  <FileUpload
                    label="Company Logo"
                    folder="agencies/logos"
                    onUploadSuccess={(url) => setValue("companyLogo", url, { shouldValidate: true })}
                    onRemove={() => setValue("companyLogo", "")}
                  />
                  <ErrorMessage message={errors.companyLogo?.message} />

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 h-12 text-black bg-slate-300"
                      onClick={() => setStep(1)}
                    >
                      <ChevronLeft className="mr-2 text-black" size={18} /> Previous
                    </Button>
                    <Button
                      type="button"
                      className="flex-2 text-white bg-blue-600 h-12 text-md font-semibold"
                      onClick={() =>
                        handleNext([
                          "city",
                          "yearEstablished",
                          "officeAddress",
                          "companyBio",
                          "companyLogo",
                        ])
                      }
                    >
                      Next Step <ChevronRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-8 duration-500">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">
                      Owner&rsquo;s Full Name
                    </Label>
                    <Input
                      {...register("ownerName")}
                      className={`bg-slate-100 h-12 ${errors.ownerName ? "border-red-500" : "border-slate-300"} placeholder-gray-400 text-black`}
                    />
                    <ErrorMessage message={errors.ownerName?.message} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">
                      Owner CNIC Number
                    </Label>
                    <Input
                      {...register("ownerCNIC")}
                      className={`bg-slate-100 h-12 ${errors.ownerCNIC ? "border-red-500" : "border-slate-300"} placeholder-gray-400 text-black`}
                      placeholder="00000-0000000-0"
                    />
                    <ErrorMessage message={errors.ownerCNIC?.message} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <FileUpload
                        label="CNIC Front"
                        folder="agencies/kyc"
                        onUploadSuccess={(url) => setValue("ownerCNICFrontUrl", url, { shouldValidate: true })}
                        onRemove={() => setValue("ownerCNICFrontUrl", "")}
                      />
                      <ErrorMessage message={errors.ownerCNICFrontUrl?.message} />
                    </div>
                    <div className="space-y-1">
                      <FileUpload
                        label="CNIC Back"
                        folder="agencies/kyc"
                        onUploadSuccess={(url) => setValue("ownerCNICBackUrl", url, { shouldValidate: true })}
                        onRemove={() => setValue("ownerCNICBackUrl", "")}
                      />
                      <ErrorMessage message={errors.ownerCNICBackUrl?.message} />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 h-12 text-black bg-slate-300"
                      onClick={() => setStep(2)}
                    >
                      <ChevronLeft className="mr-2 text-black" size={18} /> Back
                    </Button>
                    <Button
                      type="button"
                      className="flex-2 text-white bg-blue-600 h-12 text-md font-semibold"
                      onClick={() =>
                        handleNext([
                          "ownerName",
                          "ownerCNIC",
                          "ownerCNICFrontUrl",
                          "ownerCNICBackUrl",
                        ])
                      }
                    >
                      Final Step <ChevronRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-5 animate-in slide-in-from-right-8 duration-500">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">
                      WhatsApp Number
                    </Label>
                    <Input
                      {...register("whatsappNumber")}
                      className={`bg-slate-100 h-12 ${errors.whatsappNumber ? "border-red-500" : "border-slate-300"} placeholder-gray-400 text-black`}
                      placeholder="+92 ..."
                    />
                    <ErrorMessage message={errors.whatsappNumber?.message} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <FileUpload
                        label="Utility Bill"
                        folder="agencies/verification"
                        onUploadSuccess={(url) => setValue("utilityBillUrl", url, { shouldValidate: true })}
                        onRemove={() => setValue("utilityBillUrl", "")}
                      />
                      <ErrorMessage message={errors.utilityBillUrl?.message} />
                    </div>

                    <div className="space-y-1">
                      <FileUpload
                        label="Reg. Certificate"
                        folder="agencies/verification"
                        onUploadSuccess={(url) => setValue("registrationCertificateUrl", url, { shouldValidate: true })}
                        onRemove={() => setValue("registrationCertificateUrl", "")}
                      />
                      <ErrorMessage
                        message={errors.registrationCertificateUrl?.message}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 h-12 text-black bg-slate-300"
                      onClick={() => setStep(3)}
                    >
                      <ChevronLeft className="mr-2 text-black" size={18} /> Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-2 bg-[#0b1c3c] hover:bg-[#162a50] text-white h-12 text-md font-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}