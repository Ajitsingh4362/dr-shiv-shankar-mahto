// Cloudflare R2 helper — R2 speaks the S3 API, so we use the AWS SDK's S3
// client pointed at the R2 endpoint. Used by /api/upload.js to generate a
// short-lived signed URL the browser can upload directly to.
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
export const R2_BUCKET = process.env.R2_BUCKET_NAME || 'mahto-clinic-images'
// Public URL base for reading files back (R2 public bucket URL or your custom domain)
export const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL // e.g. https://images.mahtoclinic.com

let client
function getClient() {
  if (!client) {
    if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
      throw new Error('R2 credentials are not set (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)')
    }
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
    })
  }
  return client
}

/**
 * Returns a short-lived URL the browser can PUT the file bytes to directly
 * (so the image bytes never pass through our serverless function — keeps
 * things fast and avoids Vercel's request body size limits).
 */
export async function createUploadUrl(key, contentType) {
  const cmd = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType })
  const uploadUrl = await getSignedUrl(getClient(), cmd, { expiresIn: 300 }) // 5 min
  const publicUrl = R2_PUBLIC_BASE_URL ? `${R2_PUBLIC_BASE_URL}/${key}` : null
  return { uploadUrl, publicUrl, key }
}
