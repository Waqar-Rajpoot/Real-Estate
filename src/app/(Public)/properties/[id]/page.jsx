"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/PublicNavbar";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        const json = await res.json();
        if (json.success) {
          setProperty(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch property details", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">Property not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* <Navbar /> */}
      
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Title and Price Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900">{property.title}</h1>
            <p className="text-gray-500">{property.location.address}, {property.location.city}</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="text-3xl font-black text-blue-600">
              {property.currency} {property.price.toLocaleString()}
            </p>
            <span className="text-sm text-gray-400 uppercase font-bold">{property.purpose}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          <div className="lg:col-span-2 relative h-[500px] rounded-2xl overflow-hidden shadow-lg">
            <Image 
              src={property.images[activeImage]?.originalUrl} 
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 overflow-y-auto max-h-[500px]">
            {property.images.map((img, idx) => (
              <div 
                key={idx} 
                className={`relative h-32 rounded-xl overflow-hidden cursor-pointer border-4 transition-all ${activeImage === idx ? 'border-blue-600' : 'border-transparent'}`}
                onClick={() => setActiveImage(idx)}
              >
                <Image src={img.originalUrl} alt="gallery" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Key Features */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(property.features).map(([key, value]) => (
                  value === true && (
                    <div key={key} className="flex items-center text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <span className="mr-2 text-blue-500">✔</span>
                      {key.replace('has', '').replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area (Agency/Agent Info) */}
          <div className="space-y-6">
            <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-6 italic">Interested in this property?</h3>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all mb-4">
                Contact Agent
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all">
                WhatsApp Inquiry
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}