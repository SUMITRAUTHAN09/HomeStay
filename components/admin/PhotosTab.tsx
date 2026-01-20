import { GalleryImage } from '@/app/types/admin';
import { Image as ImageIcon, Loader, Plus, RefreshCw, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PhotosTabProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function PhotosTab({ onSuccess, onError }: PhotosTabProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/gallery/list');
      const data = await response.json();
      
      console.log('📥 API Response:', data);
      
      if (data.success && data.images) {
        console.log('✅ Loaded images:', data.images.length);
        setImages(data.images);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('❌ Failed to load gallery:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadProgress('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          onError(`${file.name} is not an image`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          onError(`${file.name} is too large`);
          continue;
        }

        setUploadProgress(`Uploading ${i + 1}/${files.length}: ${file.name}`);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('category', category);
        formData.append('useCloudinary', 'false');

        const response = await fetch('/api/gallery/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();
        
        console.log('Upload response:', data);

        if (!data.success) {
          throw new Error(data.error || 'Upload failed');
        }
      }

      onSuccess(`✅ Uploaded ${files.length} image(s)!`);
      setUploadProgress('');
      await loadGalleryImages();
      
    } catch (err: any) {
      console.error('Upload error:', err);
      onError(err.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm(`Delete ${image.title}?`)) return;

    setDeletingId(image.id);

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/gallery/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: image.url,
          publicId: (image as any).publicId
        })
      });

      const data = await response.json();

      if (data.success) {
        onSuccess('Deleted!');
        await loadGalleryImages();
      } else {
        throw new Error(data.error || 'Delete failed');
      }
    } catch (err: any) {
      onError(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredImages = images.filter(img => 
    filterCategory === 'all' || img.category === filterCategory
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Website Photos</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredImages.length} images
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadGalleryImages}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All ({images.length})</option>
            <option value="hero">Hero ({images.filter(i => i.category === 'hero').length})</option>
            <option value="gallery">Gallery ({images.filter(i => i.category === 'gallery').length})</option>
          </select>
        </div>
      </div>

      {uploadProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm flex items-center gap-2">
            <Loader size={16} className="animate-spin" />
            {uploadProgress}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 border">
        <h3 className="text-lg font-semibold mb-4">Upload New Images</h3>
        <div className="grid grid-cols-2 gap-4">
          {['hero', 'gallery'].map(category => (
            <div key={category}>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={(e) => handleUpload(e, category)}
                className="hidden" 
                id={`upload-${category}`} 
                disabled={uploadingImage} 
              />
              <label 
                htmlFor={`upload-${category}`}
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 ${uploadingImage ? 'opacity-50' : ''}`}
              >
                <Plus size={40} className="text-gray-400 mb-3" />
                <span className="font-medium capitalize">{category}</span>
                <span className="text-sm text-gray-500 mt-1">Click to upload</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No images</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow border group">
              <div className="relative h-48">
                {/* Simple img tag with full URL */}
                <img 
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover rounded-t-lg"
                  onError={(e) => {
                    console.error('Image failed:', image.url);
                    const target = e.target as HTMLImageElement;
                    target.style.backgroundColor = '#fee';
                    target.alt = 'Error loading image';
                  }}
                  onLoad={() => {
                    console.log('Image loaded:', image.url);
                  }}
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all">
                  <button 
                    onClick={() => handleDelete(image)}
                    disabled={deletingId === image.id}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {deletingId === image.id ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="p-3">
                <p className="text-sm font-medium truncate">{image.title}</p>
                <div className="flex justify-between mt-2">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 capitalize">
                    {image.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}