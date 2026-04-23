"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Eye, 
  AlertCircle, 
  ExternalLink,
  Plus,
  Building2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Color mapping based on your Schema enum
const statusColors = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Pending: "bg-orange-100 text-orange-700 border-orange-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  Sold: "bg-blue-100 text-blue-700 border-blue-200",
  Rented: "bg-purple-100 text-purple-700 border-purple-200",
  Expired: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function AgentPropertiesList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/agent/properties");
        const json = await response.json();
        if (json.success) {
          setProperties(json.data);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-slate-500">Fetching your listings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Property Portfolio</h1>
          <p className="text-slate-500 font-medium">Manage and track your listed properties across Pakistan.</p>
        </div>
        <Link href="/agent/properties/add">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Plus className="mr-2 h-5 w-5" /> Add New Listing
          </Button>
        </Link>
      </div>

      {/* Grid Section */}
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
          <Building2 size={60} className="text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">No Properties Found</h3>
          <p className="text-slate-500 mb-6">You haven&lsquo;t added any property listings yet.</p>
          <Link href="/agent/properties/add">
            <Button variant="outline" className="rounded-xl border-2 font-bold">Start Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {properties.map((property) => (
            <Card key={property._id} className="group overflow-hidden border-slate-200 hover:border-blue-300 transition-all hover:shadow-xl rounded-2xl">
              <CardContent className="p-0">
                <div className="flex flex-col lg:row md:flex-row">
                  {/* Image Container */}
                  <div className="relative w-full md:w-80 h-56 md:h-auto overflow-hidden">
                    <Image
                      src={property.images[0]?.originalUrl || "/placeholder-property.jpg"}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className={`${statusColors[property.status]} border px-3 py-1 font-bold text-xs uppercase shadow-sm`}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Info Container */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">{property.category} • {property.purpose}</span>
                        <div className="flex items-center gap-1 text-slate-400 font-bold text-sm">
                          <Eye size={16} /> {property.metrics.viewCount || 0}
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-black text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {property.title}
                      </h2>
                      
                      <div className="flex items-center gap-1 text-slate-500 text-sm font-medium mb-4">
                        <MapPin size={16} className="text-blue-500" />
                        {property.location.area}, {property.location.city}
                      </div>

                      {/* Rejection Notification */}
                      {property.status === "Rejected" && property.rejectionReason && (
                        <div className="mb-4 flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-red-800 uppercase tracking-tighter">Rejection Reason</p>
                            <p className="text-sm text-red-600 font-medium">{property.rejectionReason}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <div className="flex gap-4 text-slate-600">
                        <span className="flex items-center gap-1.5 font-bold text-sm"><BedDouble size={18} className="text-slate-400"/> {property.bedrooms}</span>
                        <span className="flex items-center gap-1.5 font-bold text-sm"><Bath size={18} className="text-slate-400"/> {property.bathrooms}</span>
                        <span className="flex items-center gap-1.5 font-bold text-sm"><Maximize2 size={18} className="text-slate-400"/> {property.area} {property.areaUnit}</span>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                            <span className="text-xs text-blue-600 mr-1 font-black">{property.currency}</span>
                            {property.price.toLocaleString()}
                          </p>
                          {property.purpose === "For Rent" && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Per {property.rentFrequency}</p>}
                        </div>
                        
                        <Link href={`/agent/my-properties/${property._id}`}>
                          <Button size="sm" className="bg-slate-900 hover:bg-blue-600 text-white rounded-lg font-bold group/btn">
                            Explore <ExternalLink size={14} className="ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}