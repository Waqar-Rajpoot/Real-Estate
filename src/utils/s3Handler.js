import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize the S3 client
// In Next.js, these env vars should be in your .env.local file
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim() || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim() || "",
  },
});

export const getS3PresignedUrl = async (fileName, fileType, folder) => {
  // Create a unique file key to prevent overwriting files with the same name
  const fileKey = `${folder}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
  });

  try {
    // Generate a URL valid for 60 minutes (3600 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Construct the public URL that will be saved in MongoDB
    const finalUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return {
      uploadUrl,
      finalUrl,
    };
  } catch (error) {
    console.error("S3 Presigned URL Error:", error);
    throw new Error("Failed to generate secure upload path.");
  }
};