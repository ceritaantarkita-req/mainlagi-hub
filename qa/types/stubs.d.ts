declare namespace React {
  type ReactNode = unknown;
  type CSSProperties = Record<string, string | number | undefined>;
  interface RefObject<T> { current: T | null }
  interface MutableRefObject<T> { current: T }
  interface PointerEvent<T = Element> {
    clientX: number; clientY: number; pointerId: number; currentTarget: T;
    preventDefault(): void;
  }
  interface ChangeEvent<T = Element> { target: T }
}
declare namespace JSX { interface IntrinsicAttributes { key?: string | number } interface ElementChildrenAttribute { children: unknown } interface IntrinsicElements { [name: string]: any } }
declare module "react" {
  export type ReactNode = React.ReactNode;
  export type CSSProperties = React.CSSProperties;
  export type PointerEvent<T = Element> = React.PointerEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((current: T) => T)) => void];
  export function useRef<T>(initial: T): React.MutableRefObject<T>;
  export function useRef<T>(initial: T | null): React.RefObject<T>;
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: readonly unknown[]): T;
}
declare module "next/link" { const Link: (props: any) => any; export default Link; }
declare module "next/image" { const Image: (props: any) => any; export default Image; }
declare module "next/navigation" {
  export function notFound(): never;
  export function useRouter(): { push(path: string): void; replace(path: string): void; refresh(): void };
  export function useSearchParams(): { get(key: string): string | null };
}
declare module "next/server" {
  export class NextResponse {
    static json(value: unknown, init?: unknown): NextResponse;
    static redirect(url: URL | string, status?: number): NextResponse;
  }
}
declare module "next" {
  export interface Metadata { [key: string]: unknown }
  export namespace MetadataRoute { interface Manifest { [key: string]: unknown } }
}
declare module "@mediapipe/tasks-vision" { const value: any; export = value; }
declare const process: { env: Record<string, string | undefined> };
