// services/storage/r2UploadService.js
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import env from "../../config/env";

// ✅ Cloudflare R2 Configuration (PDF Requirement: Zero egress fees)
const R2_CONFIG = {
  ENDPOINT: env.R2_ENDPOINT,
  ACCESS_KEY_ID: env.R2_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: env.R2_SECRET_ACCESS_KEY,
  BUCKET_NAME: env.R2_BUCKET_NAME,
  PUBLIC_URL: env.R2_PUBLIC_URL,
};

// Lazy-initialized S3 client
let s3Client = null;

const getS3Client = () => {
  if (!s3Client && R2_CONFIG.ENDPOINT && R2_CONFIG.ACCESS_KEY_ID && R2_CONFIG.SECRET_ACCESS_KEY) {
    s3Client = new S3Client({
      endpoint: R2_CONFIG.ENDPOINT,
      region: "auto",
      forcePathStyle: true,
      credentials: {
        accessKeyId: R2_CONFIG.ACCESS_KEY_ID,
        secretAccessKey: R2_CONFIG.SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};

/**
 * Upload file directly to Cloudflare R2.
 * No Firebase Storage — only Firestore, RTDB, and Auth are used.
 * @param {Object} file - { uri, name, type }
 * @param {string} path - Storage path (e.g., 'profiles/user123.jpg')
 * @returns {Promise<string>} Public URL
 */
export const uploadToR2 = async (file, path) => {
  const client = getS3Client();
  if (!client) {
    console.warn("R2 client not configured — upload skipped");
    return null;
  }

  try {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = reject;
      xhr.responseType = "blob";
      xhr.open("GET", file.uri, true);
      xhr.send(null);
    });

    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.BUCKET_NAME,
      Key: path,
      Body: blob,
      ContentType: file.type || "image/jpeg",
    });

    await client.send(command);

    const basePublicUrl = R2_CONFIG.PUBLIC_URL || `${R2_CONFIG.ENDPOINT}/${R2_CONFIG.BUCKET_NAME}`;
    const publicUrl = `${basePublicUrl.replace(/\/$/, "")}/${path}`;
    console.log(`Uploaded to R2: ${path}`);
    return publicUrl;
  } catch (error) {
    console.error("R2 upload failed:", error);
    throw error;
  }
};

// Export for direct use in components
export const uploadProfilePicture = (file, userId) => uploadToR2(file, `profiles/${userId}.jpg`);

export const uploadRouteImage = (file, routeId) => uploadToR2(file, `routes/${routeId}.jpg`);

export const uploadAlertPhoto = (file, alertId) => uploadToR2(file, `alerts/${alertId}.jpg`);
