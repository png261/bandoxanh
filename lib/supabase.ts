import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload image to Supabase storage
 * @param file - Image file to upload
 * @param bucket - Supabase bucket name (default: 'community-images')
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: string = 'community-images'
): Promise<string> {
  try {
    // Generate unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
    const filePath = `${fileName}`;

    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || '';
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Upload multiple images to Supabase storage
 * @param files - Array of image files to upload
 * @param bucket - Supabase bucket name (default: 'community-images')
 * @returns Array of public URLs of uploaded images
 */
export async function uploadImages(
  files: File[],
  bucket: string = 'community-images'
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, bucket));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

/**
 * Delete image from Supabase storage
 * @param publicUrl - Public URL of the image to delete
 * @param bucket - Supabase bucket name (default: 'community-images')
 */
export async function deleteImage(
  publicUrl: string,
  bucket: string = 'community-images'
): Promise<void> {
  try {
    // Extract file path from public URL
    const urlParts = publicUrl.split('/');
    const filePath = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
