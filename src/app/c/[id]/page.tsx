import { BlockiesAvatar } from "@/components/ui/blockies-avatar";
import { Card } from "@/components/ui/card";
import { DownloadButton } from "@/components/ui/download-button";
import { clients } from "@/lib/clients";
import { formatDate, getAuthorInfo, processReferences } from "@/lib/utils";
import { fetchComment } from "@ecp.eth/sdk/indexer";
import { ExternalLink } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const chainId = 8453;

  const comment = await fetchComment({
    chainId,
    commentId: id as `0x${string}`,
  });

  const authorInfo = getAuthorInfo(comment.author);
  const title = `${
    authorInfo.username ? `@${authorInfo.username}` : "Anonymous"
  } on ECP`;
  const description = comment.content || "No content";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CommentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const urlSearchParams = await searchParams;

  // Get chainId from URL search params, fallback to 8453 (Base mainnet) if not provided
  const chainId = 8453;

  // Parse custom client parameters from URL
  const customClientTitle = urlSearchParams.clientTitle as string;
  const customClientLogo = urlSearchParams.clientLogo as string;
  const customClientUrl = urlSearchParams.clientUrl as string;

  // Create custom client if all required parameters are provided
  const customClient =
    customClientTitle && customClientLogo && customClientUrl
      ? {
          title: customClientTitle,
          id: "custom",
          logo: customClientLogo,
          getLink: ({
            chainId,
            commentId,
          }: {
            chainId: number;
            commentId: string;
          }) => customClientUrl,
        }
      : null;

  // Combine custom client with existing clients (custom client first)
  const allClients = customClient ? [customClient, ...clients] : clients;

  const comment = await fetchComment({
    chainId,
    commentId: id as `0x${string}`,
  });

  const referenceImages = processReferences(comment.references || []);
  const authorInfo = getAuthorInfo(comment.author);
  const contentText = comment.content || "No content";

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card className="p-8 relative">
          {/* Action Buttons - Top Right */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Download Button */}
            <DownloadButton
              url={`/c/${id}/opengraph-image`}
              filename={`ecp-comment-${id}.png`}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200 group"
              title="Download image"
            />

            {/* External Link Icon */}
            {customClientUrl && (
              <a
                href={customClientUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200 group"
                title={`Open in ${customClientTitle || "external app"}`}
              >
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
              </a>
            )}
          </div>

          {/* Author Section */}
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <BlockiesAvatar
              src={authorInfo.avatarUrl}
              alt="Avatar"
              address={authorInfo.address}
              fallbackText={authorInfo.name}
              className="w-9 h-9"
            />

            {/* Author Info */}
            <div className="flex flex-col">
              <h2 className="text-md font-semibold">{authorInfo.name}</h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {authorInfo.username && (
                  <>
                    @{authorInfo.username}
                    <span className="text-muted-foreground/50">•</span>
                  </>
                )}
                {comment.createdAt && formatDate(comment.createdAt)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div
              className="text-base leading-relaxed"
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "normal",
              }}
            >
              {contentText}
            </div>
          </div>

          {/* Reference Images - Desktop: Side by side, Mobile: Carousel below */}
          {referenceImages.length > 0 && (
            <div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {referenceImages.map((reference, index) => (
                  <div key={index} className="flex-shrink-0 w-72 snap-start">
                    <div className="flex flex-col gap-2">
                      {reference.url ? (
                        <a
                          href={reference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block transition-opacity hover:opacity-80"
                        >
                          <Image
                            src={reference.image}
                            alt={`Reference ${index + 1}`}
                            width={288}
                            height={180}
                            className="rounded-xl border object-cover cursor-pointer"
                          />
                        </a>
                      ) : (
                        <Image
                          src={reference.image}
                          alt={`Reference ${index + 1}`}
                          width={288}
                          height={180}
                          className="rounded-xl border object-cover"
                        />
                      )}
                      {(reference.title || reference.subtitle) && (
                        <div className="flex flex-col gap-1 px-1">
                          {reference.title && (
                            <div className="text-sm font-semibold line-clamp-2">
                              {reference.title}
                            </div>
                          )}
                          {reference.subtitle && (
                            <div className="text-xs text-muted-foreground">
                              {reference.subtitle}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Client Links - Centered below card */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-4 flex-wrap justify-center">
            {allClients.map((client) => {
              return (
                <div
                  key={client.title}
                  className="group relative flex flex-col items-center"
                >
                  <a
                    href={client.getLink({ commentId: id, chainId })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 hover:bg-muted/50"
                  >
                    <Image
                      src={client.logo}
                      alt={client.title}
                      width={48}
                      height={48}
                      className="rounded-md transition-all duration-200 opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                    />
                    <div className="font-medium text-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-full mt-1 whitespace-nowrap">
                      {client.title}
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
