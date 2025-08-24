"use client";

import React, { useRef } from "react";
import { ExtendedFormField } from "@/types";
import { FieldWrapper } from "./FieldWrapper";
import { Upload, File, X } from "lucide-react";

interface FileFieldBaseProps {
  field: ExtendedFormField;
  className?: string;
}

export const FileFieldBase: React.FC<FileFieldBaseProps> = ({
  field,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFileField = (props: any) => {
    const files = props.value;
    const hasFiles = files && files.length > 0;
    const file = hasFiles ? files[0] : null;

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      props.onChange(selectedFiles);
    };

    const handleRemoveFile = () => {
      props.onChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleDropZoneClick = () => {
      fileInputRef.current?.click();
    };

    const acceptedTypes = field.acceptedFileTypes?.join(",") || "*/*";
    const maxSizeMB = field.maxFileSize || 10;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          onBlur={props.onBlur}
          accept={acceptedTypes}
          className="hidden"
          multiple={false}
        />

        {!hasFiles ? (
          <div
            onClick={handleDropZoneClick}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              props.error
                ? "border-red-300 bg-red-50 hover:bg-red-100"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Click to upload a file</p>
            <p className="text-xs text-gray-500">
              {field.acceptedFileTypes?.length
                ? `Accepted: ${field.acceptedFileTypes.join(", ")}`
                : "Any file type"}
            </p>
            <p className="text-xs text-gray-500">Max size: {maxSizeMB}MB</p>
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="w-6 h-6 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* File validation feedback */}
            {file.size > maxSizeBytes && (
              <p className="text-xs text-red-500 mt-2">
                File size exceeds {maxSizeMB}MB limit
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <FieldWrapper field={field}>
      {(props) => renderFileField(props)}
    </FieldWrapper>
  );
};
