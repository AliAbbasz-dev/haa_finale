"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, FileIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  disabled?: boolean;
  existingFiles?: Array<{
    id: string;
    file_name: string;
    file_url: string;
    file_size?: number | null;
  }>;
  onRemoveExisting?: (id: string, fileUrl: string) => void;
}

export function FileUpload({
  onFileSelect,
  accept = {
    "application/pdf": [".pdf"],
    "image/*": [".jpeg", ".jpg", ".png"],
    "text/*": [".txt"],
  },
  maxFiles = 10,
  disabled = false,
  existingFiles = [],
  onRemoveExisting,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...selectedFiles, ...acceptedFiles];
      if (newFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }
      setSelectedFiles(newFiles);
      onFileSelect(newFiles);
    },
    [selectedFiles, maxFiles, onFileSelect]
  );

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled,
  });

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Uploaded Files</p>
          <div className="space-y-2">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate block"
                    >
                      {file.file_name}
                    </a>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.file_size)}
                    </p>
                  </div>
                </div>
                {onRemoveExisting && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveExisting(file.id, file.file_url)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={disabled}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">New Files</p>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            PDF, Images, or Text files (max {maxFiles} files)
          </p>
        </div>
      </div>
    </div>
  );
}
