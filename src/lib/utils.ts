import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { renderIcon } from "@download/blockies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to generate blockies avatar as data URL (client-side)
export const generateBlockiesAvatar = (
  address: string,
  size: number = 8,
  scale: number = 10
): string | undefined => {
  // Check if we're in a browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    return undefined;
  }

  try {
    // Create a canvas element for client-side rendering
    const canvas = document.createElement("canvas");
    canvas.width = size * scale;
    canvas.height = size * scale;

    renderIcon(
      {
        seed: address.toLowerCase(),
        size,
        scale,
      },
      canvas
    );

    return canvas.toDataURL();
  } catch (error) {
    console.warn("Failed to generate blockies avatar:", error);
    return undefined;
  }
};

// Enhanced reference type with optional title and subtitle
export type EnhancedReference = {
  image: string;
  title?: string;
  subtitle?: string;
  url?: string;
};

// Helper function to truncate Ethereum address
export const truncateAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format date from various timestamp formats
export const formatDate = (timestamp: number | string | Date) => {
  let date: Date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "string") {
    date = new Date(parseInt(timestamp) * 1000);
  } else {
    date = new Date(timestamp * 1000);
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Calculate dynamic font size based on content length
export const calculateFontSize = (length: number) => {
  const minFontSize = 25;
  const maxFontSize = 36;
  const shortTextThreshold = 100; // Characters
  const longTextThreshold = 800; // Characters

  if (length <= shortTextThreshold) {
    return maxFontSize;
  } else if (length >= longTextThreshold) {
    return minFontSize;
  } else {
    // Linear interpolation between thresholds
    const ratio =
      (length - shortTextThreshold) / (longTextThreshold - shortTextThreshold);
    return Math.round(maxFontSize - ratio * (maxFontSize - minFontSize));
  }
};

// Process references to extract enhanced reference images
export const processReferences = (references: any[]): EnhancedReference[] => {
  return (
    references
      ?.map((reference): EnhancedReference | null => {
        // Direct image references
        if (reference.type === "image" && "url" in reference && reference.url) {
          return { image: reference.url };
        }

        // Image URLs (file extensions)
        if (
          "url" in reference &&
          reference.url &&
          typeof reference.url === "string" &&
          /\.(jpg|jpeg|png|gif|webp)$/i.test(reference.url)
        ) {
          return { image: reference.url };
        }

        // Webpage references with OpenGraph images
        if (
          reference.type === "webpage" &&
          "opengraph" in reference &&
          reference.opengraph &&
          typeof reference.opengraph === "object" &&
          "image" in reference.opengraph &&
          reference.opengraph.image &&
          typeof reference.opengraph.image === "string" &&
          "url" in reference &&
          reference.url
        ) {
          const ogTitle =
            "title" in reference.opengraph &&
            typeof reference.opengraph.title === "string"
              ? reference.opengraph.title
              : undefined;
          const domain = new URL(reference.url).hostname.replace("www.", "");

          return {
            image: reference.opengraph.image,
            title: ogTitle,
            subtitle: domain,
            url: reference.url,
          };
        }

        return null;
      })
      .filter((ref): ref is EnhancedReference => ref !== null) || []
  );
};

// Get author display information
export const getAuthorInfo = (author: any) => {
  const name =
    author?.ens?.name ||
    author?.farcaster?.displayName ||
    author?.farcaster?.username ||
    (author?.address && truncateAddress(author.address)) ||
    "Anonymous";

  const username = author?.farcaster?.username;

  const avatarUrl = author?.ens?.avatarUrl || author?.farcaster?.pfpUrl;

  return {
    name,
    username,
    avatarUrl,
    address: author?.address,
  };
};
