"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateBlockiesAvatar } from "@/lib/utils";
import { useEffect, useState } from "react";

interface BlockiesAvatarProps {
  src?: string;
  alt: string;
  address?: string;
  fallbackText: string;
  className?: string;
}

export function BlockiesAvatar({
  src,
  alt,
  address,
  fallbackText,
  className,
}: BlockiesAvatarProps) {
  const [blockiesUrl, setBlockiesUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Only generate blockies if no src is provided but address exists
    if (!src && address) {
      const blockies = generateBlockiesAvatar(address);
      setBlockiesUrl(blockies);
    }
  }, [src, address]);

  // Use src if available, otherwise use generated blockies, otherwise fallback to text
  const avatarSrc = src || blockiesUrl;

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarSrc} alt={alt} />
      <AvatarFallback className="text-lg font-medium">
        {fallbackText.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
