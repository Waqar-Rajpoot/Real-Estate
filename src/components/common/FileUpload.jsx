"use client";

import React, { useState, useEffect } from "react";
import { uploadToS3 } from "@/utils/uploadToS3";
import { X, UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";

const FileUpload = ({ label, folder, onUploadSuccess, onRemove }) => {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Cleanup the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // 1. Generate local preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setLoading(true);

    try {
      // 2. Upload directly using the file from the event
      const finalUrl = await uploadToS3(selectedFile, folder);

      // 3. Update parent form
      onUploadSuccess(finalUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
      handleRemove();
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (e) => {
    if (e) e.preventDefault(); // Prevent accidental form submission
    setPreview("");
    onRemove();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-37.5 bg-gray-50 hover:bg-gray-100 transition">
        {!preview ? (
          <>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleFileChange}
            />
            <UploadCloud className="w-8 h-8 text-gray-400" />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click to upload {label}
            </p>
          </>
        ) : (
          <div className="relative w-full h-32">
            {loading && (
              <div className="absolute inset-0 z-20 bg-white/60 flex items-center justify-center rounded">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            )}

            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain rounded-md"
            />

            {!loading && (
              <button
                onClick={handleRemove}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition z-30"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
