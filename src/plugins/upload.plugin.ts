import { Elysia, t } from 'elysia'
import { supabase } from '../config/supabase.config'

// Allowed types
const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic'
]

// Upload helper
export async function uploadFileToSupabase(
  file: File,
  folder: string = 'KTP'
) {
  if (!file) return null

  // Validasi tipe file
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // Validasi ukuran file (1 MB)
  if (file.size > 1 * 1024 * 1024) {
    throw new Error('File too large')
  }

  // Generate nama file
  const fileName = `${Date.now()}_${file.name}`
  const filePath = `${folder}/${fileName}`

  // Convert file ke buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Upload ke Supabase
  const { error: uploadError } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET as string)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false
    })

  if (uploadError) {
    throw uploadError
  }

  // Ambil public URL
  const {
    data: { publicUrl }
  } = supabase.storage
    .from(process.env.SUPABASE_BUCKET as string)
    .getPublicUrl(filePath)

  return {
    fileName,
    filePath,
    publicUrl
  }
}

// Plugin upload Elysia
export const uploadPlugin = new Elysia().post(
  '/upload',
  async ({ body, set }) => {
    try {
      const file = body.file

      if (!file) {
        set.status = 400
        return {
          success: false,
          message: 'File is required'
        }
      }

      const result = await uploadFileToSupabase(file)

      return {
        success: true,
        message: 'Upload success',
        data: result
      }
    } catch (error: any) {
      set.status = 400

      return {
        success: false,
        message: error.message
      }
    }
  },
  {
    body: t.Object({
      file: t.File()
    })
  }
)