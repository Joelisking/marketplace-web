'use client';
import { useRef, ChangeEvent, useState, useEffect } from 'react';
import Image from 'next/image';

interface ImagePickerProps {
  label: string;
  name: string;
  onChange: (file: File) => void;
  initialImage?: string;
  resetTrigger?: number; // optional reset trigger prop
  loading?: boolean;
}

function ImagePicker({
  name,
  onChange,
  initialImage,
  resetTrigger,
  loading = false,
}: ImagePickerProps): React.ReactElement {
  const imageInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    initialImage || null
  );

  const handlePickClick = () => {
    if (!loading) imageInput.current?.click();
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview(initialImage || null);
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => setPreview(fileReader.result as string);
    fileReader.readAsDataURL(file);
    onChange(file);
  };

  // Listen to changes in the resetTrigger prop to clear the preview.
  useEffect(() => {
    setPreview(initialImage || null);
    if (imageInput.current) {
      imageInput.current.value = '';
    }
  }, [resetTrigger, initialImage]);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        <div className="relative w-32 h-32 border border-gray-300 flex items-center justify-center overflow-hidden rounded-full">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
          {!preview && !loading && (
            <p className="text-gray-400 text-sm text-center rounded-full">
              No image selected
            </p>
          )}
          {preview && (
            <Image
              src={preview}
              alt="Selected image"
              width={128}
              height={128}
              objectFit="cover"
            />
          )}
        </div>
        <div>
          <input
            className="hidden"
            id={name}
            type="file"
            accept="image/png, image/jpeg"
            name={name}
            ref={imageInput}
            onChange={handleImageChange}
            disabled={loading}
          />
          <button
            type="button"
            onClick={handlePickClick}
            className="px-4 py-1 text-sm border shadow-md border-gray-200 text-gray-800 rounded-xl hover:bg-gray-100 transition-all hover:scale-110 disabled:opacity-60"
            disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImagePicker;
