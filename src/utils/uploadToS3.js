import axios from "axios";

export const uploadToS3 = async (file, folder) => {
  try {
    const { data } = await axios.post("/api/upload/get-url", {
      fileName: file.name,
      fileType: file.type,
      folder: folder,
    });

    const { uploadUrl, finalUrl } = data;

    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Uploading to S3: ${percentCompleted}%`);
      },
    });

    return finalUrl;
    
  } catch (error) {
    console.error("S3 Upload Utility Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to upload image to storage."
    );
  }
};