import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import { Image as ImageIcon, RotateCw, Crop, X, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, or WebP)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);

      // Compress the image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCroppedImage(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      toast.error('Failed to process image');
      console.error('Image processing error:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: false,
  });

  const handleCropComplete = useCallback(async (croppedArea: any, croppedAreaPixels: any) => {
    try {
      // Create a canvas to apply crop and rotation
      const canvas = document.createElement('canvas');
      const image = new Image();
      image.src = croppedImage!;
      
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const ctx = canvas.getContext('2d')!;
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
      onChange(croppedImage);
      setIsCropping(false);
    } catch (error) {
      toast.error('Failed to crop image');
      console.error('Crop error:', error);
    }
  }, [croppedImage, rotation, onChange]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (isCropping && croppedImage) {
    return (
      <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
        <Cropper
          image={croppedImage}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white rounded-full px-4 py-2 shadow-lg">
          <button
            onClick={handleRotate}
            className="p-2 hover:bg-primary/10 rounded-full"
            title="Rotate"
          >
            <RotateCw className="h-5 w-5 text-primary" />
          </button>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-32"
          />
          <button
            onClick={() => handleCropComplete(crop, crop)}
            className="p-2 hover:bg-primary/10 rounded-full"
            title="Apply crop"
          >
            <Crop className="h-5 w-5 text-primary" />
          </button>
        </div>
      </div>
    );
  }

  if (value) {
    return (
      <div className="relative">
        <img
          src={value}
          alt="Preview"
          className="w-full h-64 object-cover rounded-lg"
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-2 bg-error rounded-full text-white hover:bg-error/90 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-border dark:border-primary/20'
      }`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="mt-2 text-text-dark dark:text-text-light">
            Processing image...
          </p>
        </div>
      ) : (
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-primary/20" />
          <div className="mt-4">
            <button className="btn-primary flex items-center space-x-2 mx-auto">
              <Upload className="h-5 w-5" />
              <span>Choose Image</span>
            </button>
          </div>
          <p className="mt-2 text-sm text-text-dark/60">
            or drag and drop
          </p>
          <p className="text-xs text-text-dark/60 mt-1">
            JPG, PNG, or WebP up to 10MB
          </p>
        </div>
      )}
    </div>
  );
}