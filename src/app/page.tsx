import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-center flex-1 p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 items-center text-center max-w-2xl">
        <div className="flex items-center gap-4">
          <Image
            src="/logo-ecp-light.svg"
            alt="calink logo"
            width={60}
            height={60}
            priority
          />
          <h1 className="text-4xl font-bold">calink</h1>
        </div>

        <p className="text-lg text-muted-foreground">
          A client-agnostic ECP (Ethereum Comment Protocol) linker with
          OpenGraph support.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl">🔗</div>
            <h3 className="font-semibold">Client-Agnostic</h3>
            <p className="text-sm text-muted-foreground">
              View ECP comments without being tied to a specific client
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl">📱</div>
            <h3 className="font-semibold">OpenGraph Support</h3>
            <p className="text-sm text-muted-foreground">
              Rich social media previews with comment content and author info
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl">🎭</div>
            <h3 className="font-semibold">Custom Clients</h3>
            <p className="text-sm text-muted-foreground">
              Support for custom client integration via URL parameters
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>Usage:</strong> Share ECP comments with URLs like{" "}
            <code className="bg-background px-2 py-1 rounded text-xs">
              /c/&lt;commentId&gt;
            </code>
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://ecp.eth.limo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about ECP
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://github.com/stephancill/calink"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
