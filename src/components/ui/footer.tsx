import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <span>by </span>
          <a
            href="https://paper.so/u/stephancill.eth"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex items-center gap-1 font-medium text-foreground hover:underline hover:underline-offset-4 transition-colors"
          >
            @stephancill
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="mx-2">•</span>
          <a
            href="https://github.com/stephancill/calink"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-foreground hover:underline hover:underline-offset-4 transition-colors"
          >
            source
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
