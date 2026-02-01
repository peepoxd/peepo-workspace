import { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';
import { clsx } from 'clsx';

interface FileUploadProps {
  bucket: string;
  onUpload?: (path: string) => void;
  accept?: string;
  maxSize?: number; // MB
}

interface UploadedFile {
  name: string;
  path: string;
  size: number;
}

export default function FileUpload({ bucket, onUpload, accept = '*', maxSize = 10 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    for (const file of Array.from(files)) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`ไฟล์ ${file.name} มีขนาดเกิน ${maxSize}MB`);
        continue;
      }

      try {
        // Convert to base64
        const base64 = await fileToBase64(file);

        // Upload to API
        const { data } = await api.post(`/files/${bucket}`, {
          filename: file.name,
          content: base64,
          contentType: file.type,
        });

        const uploaded: UploadedFile = {
          name: file.name,
          path: data.path,
          size: file.size,
        };

        setUploadedFiles((prev) => [...prev, uploaded]);
        onUpload?.(data.path);
      } catch (err) {
        setError(`อัพโหลด ${file.name} ไม่สำเร็จ`);
      }
    }

    setUploading(false);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:...;base64, prefix
      };
      reader.onerror = reject;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          uploading && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-gray-600">
          {uploading ? 'กำลังอัพโหลด...' : 'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์'}
        </p>
        <p className="text-xs text-gray-400 mt-1">ขนาดไม่เกิน {maxSize}MB</p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <File size={20} className="text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
              </div>
              <CheckCircle size={20} className="text-green-500" />
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
