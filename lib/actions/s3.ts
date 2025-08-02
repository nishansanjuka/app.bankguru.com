"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand, // Add this import
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { ApiResponse, ApiResponseData } from "@/types/api-response";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper function to convert data URL to Buffer
function dataURLtoBuffer(dataUrl: string) {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid data URL");

  const contentType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  return { buffer, contentType };
}

interface UploadOptions {
  public?: boolean;
  key?: string;
}

// Get public URL for an object
function getPublicUrl(bucket: string, key: string): string {
  return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${bucket}/${key}`;
}

export async function uploadToS3(
  dataUrl: string,
  options: UploadOptions = {}
): Promise<ApiResponseData<string>> {
  try {
    const { buffer, contentType } = dataURLtoBuffer(dataUrl);

    // Use provided key or generate unique filename
    const key =
      options.key || `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    // Upload to S3
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    if (options.public) {
      return ApiResponse.success(
        getPublicUrl(process.env.AWS_BUCKET_NAME!, key)
      );
    }

    // Generate signed URL for private objects
    const getObjectParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand(getObjectParams),
      { expiresIn: 3600 } // URL expires in 1 hour
    );

    return ApiResponse.success(signedUrl);
  } catch (error) {
    console.error("Upload error:", error);
    return ApiResponse.failure("Upload failed");
  }
}

export async function deleteFromS3(key: string) {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Delete failed" };
  }
}

export async function uploadToS3WithProgress(
  dataUrl: string,
  options: UploadOptions = {}
): Promise<{
  uploadProgress: ReadableStream<number>;
  result: Promise<{ success: boolean; url?: string; error?: string }>;
}> {
  const { buffer, contentType } = dataURLtoBuffer(dataUrl);
  const key =
    options.key || `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const totalSize = buffer.length;

  // Create a transform stream for progress updates
  const { readable, writable } = new TransformStream<number, number>();
  let uploadedBytes = 0;

  // Create upload command with progress monitoring
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  // Create the result promise
  const resultPromise = new Promise<{
    success: boolean;
    url?: string;
    error?: string;
  }>(async (resolve) => {
    try {
      await s3Client.send(new PutObjectCommand(uploadParams));

      if (options.public) {
        resolve({
          success: true,
          url: getPublicUrl(process.env.AWS_BUCKET_NAME!, key),
        });
      } else {
        const getObjectParams = {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
        };

        const signedUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand(getObjectParams),
          { expiresIn: 3600 }
        );

        resolve({ success: true, url: signedUrl });
      }
    } catch (error) {
      console.error("Upload error:", error);
      resolve({ success: false, error: "Upload failed" });
    }
  });

  // Start progress monitoring
  const writer = writable.getWriter();
  const progressInterval = setInterval(() => {
    uploadedBytes += buffer.length / 100; // Simulate progress updates
    const progress = Math.min((uploadedBytes / totalSize) * 100, 100);
    writer.write(progress);

    if (progress >= 100) {
      clearInterval(progressInterval);
      writer.close();
    }
  }, 100);

  return {
    uploadProgress: readable,
    result: resultPromise,
  };
}

export async function uploadLargeFileToS3WithChunks(
  dataUrl: string,
  options: UploadOptions = {}
): Promise<{
  uploadProgress: ReadableStream<number>;
  result: Promise<{ success: boolean; url?: string; error?: string }>;
}> {
  const { buffer, contentType } = dataURLtoBuffer(dataUrl);
  const key =
    options.key || `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
  const totalChunks = Math.ceil(buffer.length / CHUNK_SIZE);

  // Create progress stream
  const { readable, writable } = new TransformStream<number, number>();
  const writer = writable.getWriter();

  // Create multipart upload
  const uploadResult = new Promise<{
    success: boolean;
    url?: string;
    error?: string;
  }>(async (resolve) => {
    try {
      const multipartParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
      };

      const createMultipartUpload = new CreateMultipartUploadCommand(
        multipartParams
      );
      const { UploadId } = await s3Client.send(createMultipartUpload);

      if (!UploadId) {
        throw new Error("Failed to initialize multipart upload");
      }

      const uploadedParts: { ETag: string; PartNumber: number }[] = [];

      // Upload chunks
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, buffer.length);
        const chunk = buffer.slice(start, end);

        const uploadPartParams = {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          UploadId,
          PartNumber: i + 1,
          Body: chunk,
        };

        const uploadPartCommand = new UploadPartCommand(uploadPartParams);
        const { ETag } = await s3Client.send(uploadPartCommand);

        if (ETag) {
          uploadedParts.push({ ETag, PartNumber: i + 1 });
        }

        // Update progress
        const progress = ((i + 1) / totalChunks) * 100;
        writer.write(progress);
      }

      // Complete multipart upload
      const completeParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        UploadId,
        MultipartUpload: { Parts: uploadedParts },
      };

      await s3Client.send(new CompleteMultipartUploadCommand(completeParams));

      // Generate final URL
      if (options.public) {
        resolve({
          success: true,
          url: getPublicUrl(process.env.AWS_BUCKET_NAME!, key),
        });
      } else {
        const signedUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
          }),
          { expiresIn: 3600 }
        );
        resolve({ success: true, url: signedUrl });
      }

      writer.close();
    } catch (error) {
      console.error("Chunked upload error:", error);
      writer.close();
      resolve({ success: false, error: "Upload failed" });
    }
  });

  return {
    uploadProgress: readable,
    result: uploadResult,
  };
}

export async function getFromS3(key: string) {
  try {
    const getParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };

    // Generate a signed URL that's valid for 1 hour
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand(getParams),
      { expiresIn: 3600 }
    );

    return {
      success: true,
      url: signedUrl,
    };
  } catch (error) {
    console.error("Get error:", error);
    return {
      success: false,
      error: "Failed to get object",
    };
  }
}
