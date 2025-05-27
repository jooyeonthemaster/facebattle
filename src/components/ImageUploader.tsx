import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isUploading?: boolean;
}

export default function ImageUploader({ onImageSelect, isUploading = false }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // 미리보기 생성
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // 부모 컴포넌트로 파일 전달
      onImageSelect(file);
      
      // 컴포넌트 언마운트 시 URL 객체 정리
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [onImageSelect]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': []
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB 제한
  });
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        {...getRootProps()} 
        className={`
          p-6 border-2 border-dashed rounded-xl 
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
          transition-colors duration-200 cursor-pointer hover:bg-gray-50
          ${isUploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative w-full aspect-square">
            <Image 
              src={preview}
              alt="업로드 미리보기" 
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="text-center">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48" 
              aria-hidden="true"
            >
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <p className="mt-1 text-sm text-gray-500">
              {isDragActive 
                ? '이미지를 여기에 놓으세요' 
                : '이미지를 드래그&드롭 하거나 클릭하여 업로드하세요'}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG, GIF, WEBP 파일 (최대 5MB)
            </p>
          </div>
        )}
        
        {isUploading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-600">업로드 중...</span>
          </div>
        )}
      </div>
      
      {preview && !isUploading && (
        <button 
          onClick={() => setPreview(null)} 
          className="mt-2 text-sm text-red-500 hover:text-red-700"
        >
          이미지 삭제
        </button>
      )}
    </div>
  );
} 