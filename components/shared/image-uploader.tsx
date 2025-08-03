"use client";

import type React from "react";

import { useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { uploadToS3 } from "@/lib/actions/s3";
import { toast } from "sonner";

interface ImageUploadProps<T> {
  value?: T | null;
  onChange?: (value: T | null) => void;
  label?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  type?: "file" | "data-url"; // New prop to determine the handling type
  initialValue?: string; // Optional initial image URL for file type
  isUploading?: boolean; // Optional external loading state for file type
}

export default function ImageUpload<T>({
  value,
  onChange,
  label,
  description,
  buttonText = "Upload Image",
  className,
  disabled = false,
  accept = "image/*",
  maxSize = 5, // 5MB default
  type = "data-url", // Default to existing behavior
  initialValue, // Optional initial image URL for file type
  isUploading = false, // Optional external loading state for file type
}: ImageUploadProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<string | null>(() => {
    if (type === "file") {
      // For file type, prioritize File object, then initialValue
      if (value instanceof File) {
        return URL.createObjectURL(value);
      } else if (initialValue) {
        return initialValue;
      } else {
        return null;
      }
    } else {
      // For data-url type, use existing logic
      return typeof value === "string" ? value : null;
    }
  });

  // Handle value changes from parent component
  useEffect(() => {
    if (type === "file") {
      if (value instanceof File) {
        const objectUrl = URL.createObjectURL(value);
        setProductImage(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } else if (initialValue) {
        setProductImage(initialValue);
      } else {
        setProductImage(null);
      }
    } else {
      setProductImage(typeof value === "string" ? value : null);
    }
  }, [value, type, initialValue]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (productImage && productImage.startsWith("blob:")) {
        URL.revokeObjectURL(productImage);
      }
    };
  }, [productImage]);

  const onUploadeImage = useCallback(
    async (dataUrl: string | null) => {
      if (dataUrl) {
        setLoading(true);
        const res = await uploadToS3(dataUrl, {
          public: true,
          key: `product-images/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}`,
        });
        setLoading(false);
        if (!res.success) {
          toast.error("Image upload failed: " + res.error);
          setProductImage(null);
          return;
        }

        setProductImage(res.data);
        toast.success("Image uploaded successfully!");
        onChange?.(res.data as T);
      } else {
        setProductImage(null);
        onChange?.(null);
      }
    },
    [onChange]
  );

  const handleFileForType = useCallback(
    (file: File) => {
      if (type === "file") {
        // For file type, pass the File object directly (no async upload)
        const objectUrl = URL.createObjectURL(file);
        setProductImage(objectUrl);
        onChange?.(file as T);
      } else {
        // For data-url type, convert to data URL and upload
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          onUploadeImage(dataUrl);
        };
        reader.onerror = () => {
          alert("Failed to read file");
        };
        reader.readAsDataURL(file);
      }
    },
    [type, onChange, onUploadeImage]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }

      // Handle file based on type
      handleFileForType(file);
    },
    [maxSize, handleFileForType]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (type === "file") {
      // For file type, clean up object URL and pass null
      if (productImage && productImage.startsWith("blob:")) {
        URL.revokeObjectURL(productImage);
      }
      // Reset to initialValue if available, otherwise null
      setProductImage(initialValue || null);
      onChange?.(null);
    } else {
      // For data-url type, use existing logic
      onUploadeImage(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Label and Description */}
      <div className="space-y-1">
        {label && <Label className="text-sm font-medium">{label}</Label>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Upload Button and Preview */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={handleClick}
          disabled={disabled || (type === "file" ? isUploading : loading)}
          className={cn(
            "h-8 bg-transparent",
            (type === "file" ? isUploading : loading) &&
              "opacity-60 cursor-not-allowed"
          )}
        >
          <Upload className="w-3 h-3 mr-2" />
          {type === "file"
            ? isUploading
              ? "Uploading..."
              : buttonText
            : loading
            ? "Uploading..."
            : buttonText}
        </Button>

        {/* Image Preview Thumbnail */}
        {productImage && (
          <div className="relative group">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted ring-1 ring-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productImage || "/placeholder.svg"}
                alt="Preview"
                width={640}
                height={480}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            </div>
            {/* Show remove button only if there's a value (File object for file type, or URL for data-url type) 
                or if it's not the initial value */}
            {(value || type !== "file" || productImage !== initialValue) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="absolute -top-1 -right-1 h-4 w-4 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                disabled={disabled || (type === "file" ? isUploading : loading)}
              >
                <X className="h-2 w-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
