# calink

A client-agnostic ECP (Ethereum Comment Protocol) linker with OpenGraph support.

## Overview

calink is a web application that provides shareable links for ECP comments with rich OpenGraph metadata and client-agnostic viewing. It allows users to view ECP comments in a clean, responsive interface while providing links to open the comment in their preferred ECP client.

## Features

- 🔗 **Client-Agnostic**: View ECP comments without being tied to a specific client
- 📱 **OpenGraph Support**: Rich social media previews with comment content and author info
- 🎭 **Custom Clients**: Support for custom client integration via URL parameters

## Pages

### `/c/<commentId>`

View an individual ECP comment with:

#### URL Parameters

- `clientTitle` - Custom client name
- `clientLogo` - Custom client logo URL
- `clientUrl` - Custom client URL to open the comment

Example with custom client:

```
/c/0x123...?clientTitle=MyApp&clientLogo=https://example.com/logo.png&clientUrl=https://myapp.com/comment/0x123...
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd calink
```

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. Run the development server:

```bash
bun dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
bun run build
bun start
# or
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── c/[id]/
│   │   ├── page.tsx          # Comment page component
│   │   └── opengraph-image.tsx # Dynamic OpenGraph images
│   ├── layout.tsx            # Root layout
│   └── page.tsx             # Home page
├── components/
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── clients.ts           # Client configurations
│   └── utils.ts            # Utility functions
└── types/
    └── blockies.d.ts       # Type definitions
```

## Development

### Adding New Clients

To add support for a new ECP client, update the `clients` array in `src/lib/clients.ts`:

```typescript
{
  title: "New Client",
  id: "newclient",
  logo: "/clients/newclient.png",
  getLink({ chainId, commentId }) {
    return `https://newclient.com/comment/${commentId}`;
  },
}
```

### Customizing OpenGraph Images

The dynamic OpenGraph images are generated in `src/app/c/[id]/opengraph-image.tsx`. Modify this file to customize how comment previews appear on social media.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license information here]

## Links

- [ECP Documentation](https://ecp.eth.limo)
