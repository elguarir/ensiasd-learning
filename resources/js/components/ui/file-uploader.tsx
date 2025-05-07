"use client"

import React, { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./button"
import { UploadCloud, X, FileText, File, Image } from "lucide-react"

interface FileUploaderProps {
  value?: File[]
  onChange?: (files: File[]) => void
  onRemove?: (file: File) => void
  maxFiles?: number
  maxSize?: number
  accept?: string[]
  uploadText?: string
  className?: string
  showPreview?: boolean
}

export const FileUploader = ({
  value = [],
  onChange,
  onRemove,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = ["image/*", "application/pdf", ".doc", ".docx", ".ppt", ".pptx"],
  uploadText = "Drag and drop files here or click to upload",
  className = "",
  showPreview = true,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>(value || [])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onChange?.(newFiles)
    },
    [files, maxFiles, onChange]
  )

  const removeFile = (file: File) => {
    const newFiles = files.filter((f) => f !== file)
    setFiles(newFiles)
    onChange?.(newFiles)
    onRemove?.(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    maxFiles: maxFiles - files.length,
    accept: accept.reduce((acc, curr) => {
      acc[curr] = []
      return acc
    }, {} as Record<string, string[]>),
  })

  // Get icon based on file type
  const getFileIcon = (file: File) => {
    const type = file.type
    if (type.startsWith("image/")) {
      return <Image className="h-5 w-5" />
    } else if (type === "application/pdf") {
      return <FileText className="h-5 w-5" />
    } else {
      return <File className="h-5 w-5" />
    }
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-1">
          <UploadCloud className="h-10 w-10 text-gray-500 dark:text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {uploadText}
          </p>
          <small className="text-xs text-gray-500 dark:text-gray-500">
            {files.length}/{maxFiles} files • Max {(maxSize / 1024 / 1024).toFixed(0)}MB per file
          </small>
          
          <Button 
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Select Files
          </Button>
        </div>
      </div>

      {showPreview && files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Uploaded Files</p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-800 p-3"
              >
                <div className="flex items-center gap-2">
                  {getFileIcon(file)}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(file)
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 