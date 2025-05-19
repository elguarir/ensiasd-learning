"use client"

import React, { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./button"
import { UploadCloud, X, FileText, File, Image, Paperclip } from "lucide-react"

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
  variant?: "default" | "compact"
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
  variant = "default",
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

  if (variant === "compact") {
    return (
      <div className={className}>
        <div
          {...getRootProps()}
          className={`border rounded-md p-2 cursor-pointer ${
            isDragActive 
              ? "border-primary bg-primary/5" 
              : "border-neutral-200 dark:border-neutral-700"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-neutral-500" />
              <span className="text-sm">
                {files.length > 0 
                  ? `${files.length} file(s) selected` 
                  : uploadText.split(" ").slice(0, 4).join(" ") || "Attach files"}
              </span>
            </div>
            <small className="text-xs text-neutral-500">
              {files.length}/{maxFiles}
            </small>
          </div>
        </div>

        {showPreview && files.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded border border-neutral-200 dark:border-neutral-800 p-1.5 text-sm"
              >
                <div className="flex items-center gap-1.5 overflow-hidden">
                  {getFileIcon(file)}
                  <span className="truncate">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(file)
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-neutral-300 dark:border-neutral-700"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-1">
          <UploadCloud className="h-10 w-10 text-neutral-500 dark:text-neutral-400 mb-2" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {uploadText}
          </p>
          <small className="text-xs text-neutral-500 dark:text-neutral-500">
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
                className="flex items-center justify-between rounded-md border border-neutral-200 dark:border-neutral-800 p-3"
              >
                <div className="flex items-center gap-2">
                  {getFileIcon(file)}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
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