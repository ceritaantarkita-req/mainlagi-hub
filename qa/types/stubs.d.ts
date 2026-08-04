declare namespace React {
  type ReactNode = unknown;
  type Dispatch<T> = (value: T) => void;
  type SetStateAction<T> = T | ((previous: T) => T);
  interface PointerEvent<T = Element> {
    clientX: number;
    clientY: number;
    pointerId: number;
    currentTarget: T;
  }
}

declare namespace JSX {
  interface IntrinsicElements { [elementName: string]: unknown; }
}

declare module "react" {
  export type ReactNode = React.ReactNode;
  export function useState<T>(initial: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];
  export function useRef<T>(initial: T): { current: T };
  export function useEffect(effect: () => void | (() => void), dependencies?: readonly unknown[]): void;
  export function useMemo<T>(factory: () => T, dependencies: readonly unknown[]): T;
  export function useCallback<T extends (...args: never[]) => unknown>(callback: T, dependencies: readonly unknown[]): T;
}

declare module "next/link" { const Link: (props: Record<string, unknown>) => unknown; export default Link; }
declare module "next/image" { const Image: (props: Record<string, unknown>) => unknown; export default Image; }
declare module "next/navigation" { export function notFound(): never; }
declare module "next" {
  export interface Metadata { [key: string]: unknown; }
  export namespace MetadataRoute { interface Manifest { [key: string]: unknown; } }
}
declare module "next/server" {
  export const NextResponse: { json(value: unknown): unknown };
}

declare module "@mediapipe/tasks-vision" {
  export interface NormalizedLandmark { x: number; y: number; z: number; visibility?: number; }
  export class FilesetResolver {
    static forVisionTasks(path: string): Promise<unknown>;
  }
  export class HandLandmarker {
    static createFromOptions(fileset: unknown, options: Record<string, unknown>): Promise<HandLandmarker>;
    detectForVideo(video: HTMLVideoElement, timestamp: number): {
      landmarks: NormalizedLandmark[][];
      handednesses: Array<Array<{ categoryName: string; score: number }>>;
    };
    close(): void;
  }
}

declare const process: { env: Record<string, string | undefined> };
