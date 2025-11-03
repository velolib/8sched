// src/global.d.ts
export {};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
