// services/storage/r2UploadService.js
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// ✅ Cloudflare R2 Configuration (PDF Requirement: Zero egress fees)
const R2_CONFIG = {
  ACCOUNT_ID: process.env.EXPO_PUBLIC_CF_ACCOUNT_ID,
  ACCESS_KEY_ID: process.env.EXPO_PUBLIC_CF_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.EXPO_PUBLIC_CF_SECRET_ACCESS_KEY,
  BUCKET_NAME: "bustracknow-assets",
};

// Lazy-initialized S3 client
let s3Client = null;

const getS3Client = () => {
  if (!s3Client && R2_CONFIG.ACCOUNT_ID) {
    s3Client = new S3Client({
      endpoint: `https://${R2_CONFIG.ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: "auto",
      credentials: {
        accessKeyId: R2_CONFIG.ACCESS_KEY_ID,
        secretAccessKey: R2_CONFIG.SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};

/**
 * Upload file directly to Cloudflare R2 (bypasses Firebase Storage)
 * PDF Requirement: Zero egress fees for profile pics & route images
 * @param {Object} file - { uri, name, type }
 * @param {string} path - Storage path (e.g., 'profiles/user123.jpg')
 * @returns {Promise<string>} Public URL
 */
export const uploadToR2 = async (file, path) => {
  try {
    // ✅ Fallback to Firebase Storage in development
    if (!R2_CONFIG.ACCOUNT_ID || __DEV__) {
      console.warn("⚠️ Using Firebase Storage fallback (dev mode or missing R2 config)");
      const snapshot = await uploadToFbStorage(file, path);
      const { getDownloadURL: getFbUrl } = await import("firebase/storage");
      return await getFbUrl(snapshot.ref);
    }

    const client = getS3Client();
    if (!client) throw new Error("R2 client not initialized");

    // ✅ Convert file URI to Blob
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = reject;
      xhr.responseType = "blob";
      xhr.open("GET", file.uri, true);
      xhr.send(null);
    });

    // ✅ Upload to R2
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.BUCKET_NAME,
      Key: path,
      Body: blob,
      ContentType: file.type || "image/jpeg",
      ACL: "public-read", // Critical for direct public access
    });

    await client.send(command);

    // ✅ Construct public URL (Cloudflare R2 public endpoint)
    const publicUrl = `https://${R2_CONFIG.BUCKET_NAME}.${R2_CONFIG.ACCOUNT_ID}.r2.cloudflarestorage.com/${path}`;

    console.log(`✅ Uploaded to R2: ${path}`);
    return publicUrl;
  } catch (error) {
    console.error("❌ R2 upload failed:", error);

    // ✅ Graceful fallback to Firebase Storage
    if (!__DEV__) {
      console.warn("⚠️ Falling back to Firebase Storage");
      try {
        const snapshot = await uploadToFbStorage(file, path);
        const { getDownloadURL: getFbUrl } = await import("firebase/storage");
        return await getFbUrl(snapshot.ref);
      } catch (fallbackError) {
        console.error("❌ Fallback upload also failed:", fallbackError);
        throw fallbackError;
      }
    }

    throw error;
  }
};

// Helper: Firebase Storage fallback (for development)
const uploadToFbStorage = async (file, path) => {
  const { getStorage, ref, uploadBytes } = await import("firebase/storage");
  const storage = getStorage();
  const storageRef = ref(storage, path);

  const response = await fetch(file.uri);
  const blob = await response.blob();

  return uploadBytes(storageRef, blob);
};

// ✅ Export for direct use in components
export const uploadProfilePicture = (file, userId) => uploadToR2(file, `profiles/${userId}.jpg`);

export const uploadRouteImage = (file, routeId) => uploadToR2(file, `routes/${routeId}.jpg`);

export const uploadAlertPhoto = (file, alertId) => uploadToR2(file, `alerts/${alertId}.jpg`);
