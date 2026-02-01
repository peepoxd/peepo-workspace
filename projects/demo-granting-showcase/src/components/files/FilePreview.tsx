import { useState } from 'react';
import { X, Download, FileText, Image, File, Eye, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

interface FilePreviewProps {
  url: string;
  filename: string;
  mimeType: string;
  onClose?: () => void;
}

export default function FilePreview({ url, filename, mimeType, onClose }: FilePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-3 text-white">
          {isImage ? <Image size={20} /> : isPdf ? <FileText size={20} /> : <File size={20} />}
          <span className="font-medium">{filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            title="เปิดในแท็บใหม่"
          >
            <ExternalLink size={20} />
          </a>
          <a
            href={url}
            download={filename}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            title="ดาวน์โหลด"
          >
            <Download size={20} />
          </a>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="ปิด"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl max-h-[85vh] overflow-auto rounded-lg bg-white">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {error ? (
          <div className="p-8 text-center">
            <File size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">ไม่สามารถแสดงตัวอย่างไฟล์ได้</p>
            <a
              href={url}
              download={filename}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download size={18} />
              ดาวน์โหลดไฟล์
            </a>
          </div>
        ) : isImage ? (
          <img
            src={url}
            alt={filename}
            onLoad={handleLoad}
            onError={handleError}
            className="max-w-full h-auto"
          />
        ) : isPdf ? (
          <iframe
            src={url}
            title={filename}
            onLoad={handleLoad}
            onError={handleError}
            className="w-[800px] h-[85vh]"
          />
        ) : (
          <div className="p-8 text-center">
            <File size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">ไม่รองรับการแสดงตัวอย่างไฟล์ประเภทนี้</p>
            <a
              href={url}
              download={filename}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download size={18} />
              ดาวน์โหลดไฟล์
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// File card component for lists
interface FileCardProps {
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt?: string;
  onPreview?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export function FileCard({
  filename,
  mimeType,
  size,
  uploadedAt,
  onPreview,
  onDownload,
  onDelete,
}: FileCardProps) {
  const getFileIcon = () => {
    if (mimeType.startsWith('image/')) return <Image size={24} className="text-purple-500" />;
    if (mimeType === 'application/pdf') return <FileText size={24} className="text-red-500" />;
    return <File size={24} className="text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="p-2 bg-gray-50 rounded-lg">{getFileIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{filename}</p>
        <p className="text-xs text-gray-500">
          {formatFileSize(size)}
          {uploadedAt && ` • ${new Date(uploadedAt).toLocaleDateString('th-TH')}`}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {onPreview && (
          <button
            onClick={onPreview}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="ดูตัวอย่าง"
          >
            <Eye size={18} />
          </button>
        )}
        {onDownload && (
          <button
            onClick={onDownload}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="ดาวน์โหลด"
          >
            <Download size={18} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="ลบ"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
