export interface Client {
  title: string;
  id: string;
  logo: string;
  getLink: ({
    chainId,
    commentId,
  }: {
    commentId: string;
    chainId: number;
  }) => string;
}

export const clients: Client[] = [
  {
    title: "town",
    id: "town",
    logo: "/clients/town.png",
    getLink({ commentId }) {
      return `https://town.steer.fun/c/${commentId}`;
    },
  },
  {
    title: "Interface",
    id: "interface",
    logo: "/clients/interface.png",
    getLink({ chainId, commentId }) {
      return `https://app.interface.social/tx/${chainId}/${commentId}`;
    },
  },
  {
    title: "Paper",
    id: "paper",
    logo: "/clients/paper.png",
    getLink({ commentId }) {
      return `https://paper.ink/p/${commentId}`;
    },
  },
];
