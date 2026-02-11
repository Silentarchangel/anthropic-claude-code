"use client";

import { useCallback, useState } from "react";

interface FileUploadProps {
  label: string;
  description: string;
  accept: string;
  onFileSelected: (file: File) => void;
  fileName?: string;
}

export default function FileUpload({
  label,
  description,
  accept,
  onFileSelected,
  fileName,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
        isDragOver
          ? "border-blue-500 bg-blue-50"
          : fileName
          ? "border-green-400 bg-green-50"
          : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-700">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
        {fileName ? (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {fileName}
          </div>
        ) : (
          <div className="text-xs text-gray-400 mt-1">
            Drag & drop or click to browse
          </div>
        )}
      </div>
    </div>
  );
}
