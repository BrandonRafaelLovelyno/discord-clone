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
}

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  endpoint,
  onChange,
}) => {
  const fileType = value?.split(".").pop();
  if (value && fileType != "pdf") {
    return (
      <m.div
        className="relative w-24 h-24 rounded-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Image
          alt="server image"
          src={value}
          fill
          objectFit="fit"
          className="rounded-full"
        />
        <button
          className="absolute flex items-center justify-center w-8 h-8 bg-red-500 rounded-full -top-2 -right-2"
          onClick={() => onChange("")}
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
