import { ImageResponse } from "next/og";
import { fetchComment } from "@ecp.eth/sdk/indexer";
import { renderIcon } from "@download/blockies";
import { createCanvas } from "canvas";
import {
  processReferences,
  EnhancedReference,
  calculateFontSize,
} from "@/lib/utils";

export const alt = "ecp-image";
export const size = {
  width: 1200,
  height: 800,
};

export const contentType = "image/png";

// Helper function to generate blockies avatar as data URL
const generateBlockiesAvatar = (
  address: string,
  size: number = 8,
  scale: number = 10
): string => {
  const canvas = createCanvas(size * scale, size * scale);

  renderIcon(
    {
      seed: address.toLowerCase(),
      size,
      scale,
    },
    canvas as any
  );

  return canvas.toDataURL();
};

// Helper function to truncate Ethereum address
const truncateAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default async function Image({
  params,
}: {
  params: Promise<{ id: `0x${string}` }>;
}) {
  const { id } = await params;

  // Get chainId from URL search params, fallback to 8453 (Base mainnet) if not provided
  const chainId = 8453;

  const comment = await fetchComment({
    chainId,
    commentId: id,
  });

  // Format date
  const formatDate = (timestamp: number | string | Date) => {
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

  // Get up to 2 reference images (including webpage OpenGraph images)
  const referenceImages: EnhancedReference[] = processReferences(
    comment.references || []
  ).slice(0, 2);

  // Dynamic font sizing based on content length
  const contentText = comment.content || "No content";
  const textLength = contentText.length;

  const dynamicFontSize = calculateFontSize(textLength);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#FFFFFF",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          position: "relative",
        }}
      >
        {/* Logo - Top Right */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "60px",
            width: "72px",
            height: "66px",
            display: "flex",
          }}
        >
          <svg
            width="72"
            height="66"
            viewBox="0 0 2022 1865"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2022.01 932.5C2022.01 1447.51 1604.51 1865 1089.51 1865C886.705 1865 699.024 1800.26 546.002 1690.32L0.893227 1727.15L222.284 1275.93C180.159 1169.65 157.007 1053.78 157.007 932.5C157.007 417.494 574.502 0 1089.51 0C1604.51 0 2022.01 417.494 2022.01 932.5ZM1475.61 912.207L1089.91 256L704.212 912.207L1089.91 1152.21L1475.61 912.207ZM1089.91 1539.92L1476.01 989.266L1089.91 1231.28L703.008 989.266L1089.91 1539.92Z"
              fill="black"
            />
          </svg>
        </div>

        {/* Header with author info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
            gap: "16px",
          }}
        >
          {/* Avatar */}
          {comment.author?.ens?.avatarUrl ||
          comment.author?.farcaster?.pfpUrl ? (
            <img
              src={
                comment.author?.ens?.avatarUrl ||
                comment.author?.farcaster?.pfpUrl ||
                ""
              }
              alt="Avatar"
              style={{
                width: "79px",
                height: "79px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : comment.author?.address ? (
            <img
              src={generateBlockiesAvatar(comment.author.address)}
              alt="Blockies Avatar"
              style={{
                width: "79px",
                height: "79px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "79px",
                height: "79px",
                borderRadius: "50%",
                backgroundColor: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "31px",
                color: "#6B7280",
              }}
            >
              ?
            </div>
          )}

          {/* Author details */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              {comment.author?.ens?.name ||
                comment.author?.farcaster?.displayName ||
                comment.author?.farcaster?.username ||
                (comment.author?.address &&
                  truncateAddress(comment.author.address)) ||
                "Anonymous"}
            </div>
            <div
              style={{
                fontSize: "27px",
                color: "#6B7280",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {comment.author?.farcaster?.username && (
                <>
                  @{comment.author.farcaster.username}
                  <span style={{ color: "#D1D5DB" }}>•</span>
                </>
              )}
              {comment.createdAt && formatDate(comment.createdAt)}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "40px",
          }}
        >
          {/* Content */}
          <div
            style={{
              flex: referenceImages.length > 0 ? "1" : "1",
              display: "flex",
              flexDirection: "column",
              minHeight: 0, // Allow flex child to shrink
            }}
          >
            <div
              style={{
                fontSize: `${dynamicFontSize}px`,
                lineHeight: "1.4",
                color: "#111827",
                flex: 1,
                display: "-webkit-box",
                WebkitLineClamp: referenceImages.length > 0 ? 16 : 22,
                WebkitBoxOrient: "vertical",
                textOverflow: "ellipsis",
                wordBreak: "break-all",
                overflowWrap: "break-word",
              }}
            >
              {contentText}
            </div>
          </div>

          {/* Reference images */}
          {referenceImages.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection:
                  referenceImages.length === 1 ? "column" : "column",
                gap: "16px",
                width: "300px",
              }}
            >
              {referenceImages.map((reference, index: number) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <img
                      src={reference.image}
                      alt={`Reference ${index + 1}`}
                      style={{
                        width: "100%",
                        height:
                          referenceImages.length === 1 ? "200px" : "140px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                      }}
                    />
                    {(reference.title || reference.subtitle) && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        {reference.title && (
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#111827",
                              lineHeight: "1.2",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {reference.title}
                          </div>
                        )}
                        {reference.subtitle && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#6B7280",
                              lineHeight: "1.2",
                            }}
                          >
                            {reference.subtitle}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=31536000",
      },
    }
  );
}
