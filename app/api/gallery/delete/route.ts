import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * DELETE /api/gallery/delete
 * Delete image from gallery (Cloudinary or local)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { imageUrl, publicId } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL required' },
        { status: 400 }
      );
    }

    // Check if it's a Cloudinary image
    if (publicId && imageUrl.includes('cloudinary.com')) {
      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok' || result.result === 'not found') {
        return NextResponse.json({ success: true });
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to delete from Cloudinary' },
        { status: 500 }
      );
    } else {
      // Delete from local filesystem
      try {
        // Extract file path from URL (e.g., /gallery/image.jpg -> public/gallery/image.jpg)
        const urlPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        const filepath = path.join(process.cwd(), 'public', urlPath);
        
        await unlink(filepath);
        return NextResponse.json({ success: true });
      } catch (error: any) {
        console.error('Delete error:', error);
        
        // File might not exist, still return success
        if (error.code === 'ENOENT') {
          return NextResponse.json({ success: true });
        }
        
        return NextResponse.json(
          { success: false, error: 'Failed to delete file' },
          { status: 500 }
        );
      }
    }

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}