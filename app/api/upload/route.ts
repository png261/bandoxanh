import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for community posts)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `community/${fileName}`;
    const bucketName = 'bandoxanh';

    console.log('Community upload:', { fileName, filePath, size: file.size, type: file.type });

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload file using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error details:', {
        message: error.message,
        name: error.name,
      });
      return NextResponse.json(
        { 
          error: `Upload failed: ${error.message}`,
          details: error.message
        },
        { status: 500 }
      );
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrlData?.publicUrl || '',
      path: filePath,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
