// socket/types.ts
export type EventHandler = (data: any) => void;

export interface SocketOptions {
  query?: Record<string, string>;
  autoConnect?: boolean;
  timeout?: number;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  randomizationFactor?: number;
}

export type DisconnectReason =
  'io server disconnect' |
  'io client disconnect' |
  'ping timeout' |
  'transport close' |
  'transport error';

export interface SocketEventMap {
  connect: () => void;
  disconnect: (reason: DisconnectReason) => void;
  connect_error: (error: Error) => void;
  reconnect: (attempt: number) => void;
  reconnect_attempt: (attempt: number) => void;
  reconnecting: (attempt: number) => void;
  reconnect_error: (error: Error) => void;
  reconnect_failed: () => void;
  ping: () => void;
  pong: (latency: number) => void;
}