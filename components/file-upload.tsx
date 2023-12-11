"use client";

import { UploadDropzone } from "@/lib/upload/uploadthing";
import React from "react";
import Image from "next/image";
import { File, X } from "lucide-react";
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
          type="button"
          className="absolute flex items-center justify-center w-5 h-5 bg-red-500 rounded-full -top-4 right-1"
          onClick={() => onChange("")}
          disabled={isSubmitting}
        >
          <X />
        </button>
      </m.div>
    );
  } else if (value && fileType == "pdf") {
    return (
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0, y: -20 }}
        key="non-image"
        className="relative flex flex-row w-full bg-background/10"
      >
        <File className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
        <div className="flex-1 ml-2">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            {value}
          </a>
        </div>
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={isSubmitting}
          className="absolute flex items-center justify-center w-5 h-5 bg-red-500 rounded-full -top-4 right-1"
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
      key="non-value"
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
