"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AgentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const res = await fetch(`/api/agency/my-agents/${id}`);
        const data = await res.json();
        if (data.success) setAgent(data.agent);
      } catch (err) {
        console.error(err);
        console.error("Error fetching agent");
      } finally {
        setLoading(false);
      }
    };
    fetchAgentDetails();
  }, [id]);

  if (loading)
    return <div className="p-20 text-center">Loading Profile...</div>;
  if (!agent)
    return (
      <div className="p-20 text-center text-red-500">Agent not found.</div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2 text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} /> Back to Agents
        </Button>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
            <Image
              src={agent.profilePicture || "/default-avatar.png"}
              alt={agent.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {agent.fullName}
              </h1>
              {agent.isVerified ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <Shield className="text-amber-500" size={24} />
              )}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin size={16} /> {agent.serviceCity}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={16} /> {agent.specialization} Agent
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} /> Joined{" "}
                {new Date(agent.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Button className={agent.isActive ? "bg-green-600" : "bg-red-600"}>
              {agent.isActive ? "Active Account" : "Suspended"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Contact & Bio */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-200 text-slate-900">
              <CardHeader>
                <CardTitle>About Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed italic">
                  &quot;{agent.aboutAgent}&quot;
                </p>
                <div className="grid grid-cols-2 mt-6 gap-6 pt-6 border-t">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Email
                    </p>
                    <p className="flex items-center gap-2 text-slate-900">
                      <Mail size={14} /> {agent.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                      WhatsApp
                    </p>
                    <p className="flex items-center gap-2 text-slate-900">
                      <Phone size={14} /> {agent.whatsappNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 text-slate-900">
              <CardHeader>
                <CardTitle>Identity Verification (CNIC)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">
                      Front Side
                    </p>
                    <div className="relative h-48 rounded-xl border overflow-hidden">
                      <Image
                        src={agent.cnicFrontUrl}
                        fill
                        className="object-cover"
                        alt="CNIC Front"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">
                      Back Side
                    </p>
                    <div className="relative h-48 rounded-xl border overflow-hidden">
                      <Image
                        src={agent.cnicBackUrl}
                        fill
                        className="object-cover"
                        alt="CNIC Back"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-sm font-bold text-slate-700">
                    CNIC Number:{" "}
                    <span className="font-mono text-blue-600 ml-2">
                      {agent.cnic}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Experience & Stats */}
          <div className="space-y-8">
            <Card className="border-slate-200 bg-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase">
                    Experience Since
                  </p>
                  <p className="text-xl font-bold">
                    {new Date(agent.experienceSince).getFullYear()}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase">
                    BRN / License
                  </p>
                  <p className="text-lg font-mono">
                    {agent.brnNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase">
                    Nationality
                  </p>
                  <p className="text-lg">{agent.nationality}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 text-slate-900">
              <CardHeader>
                <CardTitle>Service Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 text-sm">Languages</span>
                  <span className="text-sm font-bold">
                    {agent.languages.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 text-sm">Total Listings</span>
                  <span className="text-sm font-bold text-blue-600">
                    {agent.totalListings}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 text-sm">Response Time</span>
                  <span className="text-sm font-bold text-green-600">
                    {agent.avgResponseTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
