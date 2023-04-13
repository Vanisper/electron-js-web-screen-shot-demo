import { Channels } from "../src-electron/preload";

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, arg: unknown[]): void;
        sendSync<T = unknown>(channel: Channels, arg: unknown[]): T;
        on(
          channel: Channels,
          func: (...arg: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
        invoke<T = unknown>(channel: Channels, ...args: unknown[]): Promise<T>;
      };
    };
  }
}
