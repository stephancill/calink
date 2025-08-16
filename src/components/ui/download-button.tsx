"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Download function to handle image download
const downloadImage = async (
  url: string,
  filename: string = "opengraph-image.png"
) => {
  try {
    // Convert relative URL to absolute URL if needed
    const fullUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url}`;
    const response = await fetch(fullUrl);
    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

interface DownloadButtonProps {
  url: string;
  filename?: string;
  className?: string;
  title?: string;
}

export function DownloadButton({
  url,
  filename = "opengraph-image.png",
  className,
  title = "Download image",
}: DownloadButtonProps) {
  const handleDownload = () => {
    downloadImage(url, filename);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDownload}
      className={className}
      title={title}
    >
      <Download className="w-5 h-5" />
    </Button>
  );
}
