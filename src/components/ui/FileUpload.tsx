import React, { useRef, useState } from 'react';
import { Button } from './Button';
import { cn } from '../../lib/utils';
import { uploadImage } from '../../lib/storage';

export interface FileUploadProps {
  onUpload: (url: string, file: File) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
  folder?: 'posts' | 'projects' | 'notes' | 'articles' | 'general';
  className?: string;
  children?: React.ReactNode;
}

export function FileUpload({
  onUpload,
  onError,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  folder = 'general',
  className,
  children,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      return `File type not supported. Accepted: ${accept}`;
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onError?.(validationError);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      if (url) {
        onUpload(url, file);
      } else {
        onError?.('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError?.('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  if (children) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn('cursor-pointer', className)}
        >
          {children}
        </div>
      </>
    );
  }

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
        dragActive ? 'border-primary-500 bg-primary-50' : 'border-border',
        uploading && 'opacity-50 pointer-events-none',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {uploading ? (
        <div className="space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept} up to {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            Choose File
          </Button>
        </div>
      )}
    </div>
  );
}

export function ImagePreview({
  src,
  alt,
  onRemove,
  className,
}: {
  src: string;
  alt: string;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('relative group', className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-48 object-cover rounded-lg border border-border"
      />
      {onRemove && (
        <Button
          variant="ghost"
          size="small"
          onClick={onRemove}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
        >
          ✕
        </Button>
      )}
    </div>
  );
}