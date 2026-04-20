import { getS3PresignedUrl } from "@/utils/s3Handler"; // Adjusted to use @ alias
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1. Parse the request body
    const { fileName, fileType, folder } = await req.json();

    // 2. Validate input
    if (!fileName || !fileType) {
      return NextResponse.json(
        { message: "Missing fileName or fileType" },
        { status: 400 }
      );
    }

    // 3. Generate the S3 URL using your existing utility
    const data = await getS3PresignedUrl(fileName, fileType, folder);

    console.log("Generated S3 presigned URL for:", fileName);

    // 4. Return the response
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error("Error generating S3 presigned URL:", error);
    
    return NextResponse.json(
      { message: "S3 Error", error: error.message },
      { status: 500 }
    );
  }
}