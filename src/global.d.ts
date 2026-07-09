declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "react-dom/client" {
  export function createRoot(container: Element | DocumentFragment): {
    render(children: unknown): void;
  };
}

declare module "react" {
  const React: any;
  export default React;
  export const useState: any;
  export const useEffect: any;
  export const useMemo: any;
  export const useRef: any;
  export const createElement: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
