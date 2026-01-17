import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "react-native-get-random-values"; // Polyfill required for AWS SDK in RN
import "react-native-url-polyfill/auto"; // Polyfill required for AWS SDK in RN
import {
	R2_ACCESS_KEY_ID,
	R2_ACCOUNT_ID,
	R2_BUCKET_NAME,
	R2_PUBLIC_URL,
	R2_SECRET_ACCESS_KEY,
} from "../../config/env";

/**
 * Handles uploads to Cloudflare R2 (S3 Compatible).
 * Bypasses Firebase Storage to save costs.
 */

// Initialize S3 Client pointing to Cloudflare
const R2Client = new S3Client({
	region: "auto",
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
});

export const R2UploadService = {
	/**
	 * Upload a file (image) to R2
	 * @param {string} localUri - The file URI from device (e.g., from ImagePicker)
	 * @param {string} folder - 'profiles' or 'bus_reports'
	 * @returns {string} - The public URL of the uploaded file
	 */
	uploadImage: async (localUri, folder = "misc") => {
		try {
			// 1. Prepare Blob from URI
			const response = await fetch(localUri);
			const blob = await response.blob();

			// 2. Generate Unique Filename
			const filename = `${folder}/${Date.now()}-${Math.floor(
				Math.random() * 1000
			)}.jpg`;

			// 3. Create Upload Command
			const command = new PutObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: filename,
				Body: blob,
				ContentType: "image/jpeg",
			});

			// 4. Send to R2
			await R2Client.send(command);

			// 5. Return Public URL
			// Ensure R2_PUBLIC_URL is set in env (e.g., https://pub-xxxx.r2.dev)
			return `${R2_PUBLIC_URL}/${filename}`;
		} catch (error) {
			console.error("R2 Upload Error:", error);
			throw new Error("Failed to upload image to storage.");
		}
	},
};
