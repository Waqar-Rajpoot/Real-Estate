"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Lock, CreditCard, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import FileUpload from "@/components/common/FileUpload";

export default function AddAgentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    whatsappNumber: "",
    cnic: "",
    cnicFrontUrl: "",
    cnicBackUrl: "",
    nationality: "Pakistani",
    profilePicture: "",
    aboutAgent: "",
    experienceSince: "",
    brnNumber: "",
    languages: "",
    serviceCity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to handle FileUpload success
  const handleUpload = (field, url) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for compulsory file uploads
    if (!formData.profilePicture || !formData.cnicFrontUrl) {
      return toast.error("Profile picture and CNIC Front are compulsory");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/agency/add-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // Convert languages string to array if needed by your schema
          languages: formData.languages
            .split(",")
            .map((l) => l.trim())
            .filter((l) => l !== ""),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        router.push("/agency/agents");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding agent:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Shared input style to match your requirements
  const inputStyle =
    "border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
            <UserPlus size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add New Agent</h1>
            <p className="text-slate-500">
              Create a profile for your team member
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Credentials & Photos */}
          <Card className="border border-slate-300 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-slate-900 gap-2">
                <Lock className="text-blue-600" size={18} /> Account Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    Full Name *
                  </label>
                  <Input
                    name="fullName"
                    type="text"
                    className={inputStyle}
                    placeholder="John Doe"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    Email *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    className={inputStyle}
                    placeholder="agent@agency.com"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    Password *
                  </label>
                  <Input
                    name="password"
                    type="password"
                    className={inputStyle}
                    placeholder="••••••••"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    Nationality
                  </label>
                  <Input
                    name="nationality"
                    className={inputStyle}
                    value={formData.nationality}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="text-sm text-slate-900 font-semibold mb-3 block">
                  Profile Picture *
                </label>
                <FileUpload
                  label="Agent Photo"
                  folder="agents/profiles"
                  onUploadSuccess={(url) => handleUpload("profilePicture", url)}
                  onRemove={() => handleUpload("profilePicture", "")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Identity & Contact */}
          <Card className="border border-slate-300 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <CreditCard className="text-blue-600" size={18} /> Identity &
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    CNIC Number *
                  </label>
                  <Input
                    name="cnic"
                    className={inputStyle}
                    placeholder="42101-xxxxxxx-x"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    WhatsApp Number *
                  </label>
                  <Input
                    name="whatsappNumber"
                    className={inputStyle}
                    placeholder="+92..."
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    Phone Number
                  </label>
                  <Input
                    name="phoneNumber"
                    className={inputStyle}
                    placeholder="+92..."
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    Service City
                  </label>
                  <Input
                    name="serviceCity"
                    className={inputStyle}
                    placeholder="Lahore"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    CNIC Front Side *
                  </label>
                  <FileUpload
                    label="Front Image"
                    folder="agents/verification"
                    onUploadSuccess={(url) => handleUpload("cnicFrontUrl", url)}
                    onRemove={() => handleUpload("cnicFrontUrl", "")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    CNIC Back Side
                  </label>
                  <FileUpload
                    label="Back Image"
                    folder="agents/verification"
                    onUploadSuccess={(url) => handleUpload("cnicBackUrl", url)}
                    onRemove={() => handleUpload("cnicBackUrl", "")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Professional Details */}
          <Card className="border border-slate-300 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Briefcase className="text-blue-600" size={18} /> Professional
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    Exp. Since (Year)
                  </label>
                  <Input
                    name="experienceSince"
                    type="number"
                    className={inputStyle}
                    placeholder="2018"
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    BRN / License
                  </label>
                  <Input
                    name="brnNumber"
                    className={inputStyle}
                    placeholder="BRN-12345"
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-900 font-semibold">
                    Languages
                  </label>
                  <Input
                    name="languages"
                    className={inputStyle}
                    placeholder="English, Urdu"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-900 font-semibold">
                  About Agent
                </label>
                <Textarea
                  name="aboutAgent"
                  className={`${inputStyle} min-h-25`}
                  placeholder="Brief bio of the agent..."
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="border-slate-300 bg-slate-300 text-slate-700"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-8 transition-colors"
            >
              {loading ? "Registering..." : "Register Agent"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
