declare module "@download/blockies" {
  interface BlockiesOptions {
    seed?: string;
    size?: number;
    scale?: number;
    color?: string;
    bgcolor?: string;
  }

  export function createIcon(options?: BlockiesOptions): HTMLCanvasElement;
  export function renderIcon(options: BlockiesOptions, canvas: any): any;
}
