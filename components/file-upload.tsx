"use client";

import { UploadDropzone } from "@/lib/upload/uploadthing";
import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion as m } from "framer-motion";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
  endpoint: "messageFile" | "serverImage";
  onChange: (url?: string) => void;
  value?: string;
  isSubmitting: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  endpoint,
  onChange,
  isSubmitting,
}) => {
  const fileType = value?.split(".").pop();
  if (value && fileType != "pdf") {
    return (
      <m.div
        className="relative w-24 h-24 rounded-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, y: -20 }}
        key="image"
      >
        <Image
          alt="server image"
          src={value}
          fill
          objectFit="fit"
          className="rounded-full"
        />
        <button
          className="absolute flex items-center justify-center w-3 h-3 bg-red-500 rounded-full -top-2 -right-2"
          onClick={() => onChange("")}
          disabled={isSubmitting}
        >
          <X />
        </button>
      </m.div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0, y: -20 }}
      key="non-image"
    >
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
          console.log(value);
          toast.success("success");
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message);
        }}
      />
    </m.div>
  );
};

export default FileUpload;
