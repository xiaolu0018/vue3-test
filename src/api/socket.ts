// socket/index.ts
import type { Ref } from 'vue';
import type { EventHandler, DisconnectReason, SocketOptions, SocketEventMap } from '@/types/socket'

// 封装WebSocket连接
export class Socket {
  private socket: WebSocket | null = null;
  private url: string;
  private queryParams: Record<string, string> = {};
  private eventHandlers: Record<string, EventHandler[]> = {};
  private connected = false; // 改为普通布尔值
  private connecting = false; // 改为普通布尔值
  private lastError: string | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // 初始重连延迟(ms)
  private maxReconnectDelay = 5000; // 最大重连延迟(ms)
  private heartbeatInterval = 25000; // 心跳间隔(ms)
  private pingTimeout = 10000; // ping超时时间(ms)
  private lastPingTime = 0;

  constructor(url: string, options: { query?: Record<string, string> } = {}) {
    this.url = url;
    this.queryParams = options?.query || {};
    this.connect();
  }

  // 连接到服务器
  connect() {
    if (this.connecting || this.connected) return;

    this.connecting = true;
    this.lastError = null;

    // 构建带查询参数的URL
    const queryString = Object.entries(this.queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const fullUrl = queryString ? `${this.url}?${queryString}` : this.url;

    try {
      this.socket = new WebSocket(fullUrl);
      this.setupSocketEvents();
    } catch (error) {
      this.handleConnectionError(error instanceof Error ? error.message : 'WebSocket连接错误');
    }
  }

  // 断开连接
  disconnect(reason: DisconnectReason = 'io client disconnect') {
    // this.emit('disconnect', reason);

    // 2. 清理资源（关闭连接）
    this.clearResources();

    // 3. 更新状态（确保在清理后执行）
    this.connected = false;
    this.connecting = false;
  }
  // 新增：强制销毁（用于Store的destroy）
  destroy() {
    this.clearResources();
    this.reconnectAttempts = 0;
    this.lastError = null;
    this.connected = false;
    this.connecting = false;
  }
  // 发送消息
  emit(event: string, data: any = {}) {
    if (!this.connected) {
      console.warn(`无法发送消息: 未连接到服务器 (事件: ${event})`);
      return false;
    }

    try {
      const message = JSON.stringify({ event, data });
      this.socket?.send(message);
      return true;
    } catch (error) {
      console.error(`发送消息失败 (事件: ${event}):`, error);
      return false;
    }
  }

  // 监听事件
  on(event: string, handler: EventHandler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [handler];
    }
    this.eventHandlers[event].push(handler);
    return this;
  }

  // 取消监听事件
  off(event: string, handler?: EventHandler) {
    if (!this.eventHandlers[event]) return this;
    if (handler) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler);
    } else {
      delete this.eventHandlers[event];
    }
    return this;
  }

  // 监听一次事件
  once(event: string, handler: EventHandler) {
    const onceHandler = (data: any) => {
      handler(data);
      this.off(event, onceHandler);
    };
    return this.on(event, onceHandler);
  }

  // 获取连接状态
  get status() {
    return {
      connected: this.connected,
      connecting: this.connecting,
      lastError: this.lastError,
    };
  }

  // 设置WebSocket事件处理
  private setupSocketEvents() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.connecting = false;
      this.connected = true;
      this.reconnectAttempts = 0;
      // this.startHeartbeat();
      // this.emit('connect');
    };

    this.socket.onmessage = (event) => {
      try {
        console.log('WebSocket接收到消息:', event)
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        // 处理非JSON消息
        console.error('WebSocket接收到非JSON消息:', error)
        if (event.data && typeof event.data === 'string') {
          this.handleMessage({
            event: 'message',
            data: {
              message: event.data,
            },
          })
        }
        // this.emit('message', event.data);
        // this.handleMessage(data);
      }
    };

    this.socket.onclose = (event) => {
      this.connected = false;
      this.connecting = false;

      if (this.heartbeatTimer) {
        clearTimeout(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }

      const reason = this.getDisconnectReason(event);

      // 发送disconnect事件（区分主动/被动断开）
      if (reason === 'io client disconnect') {
        // 主动断开：不重连，不发送事件（由disconnect()方法发送）
        return;
      }
      this.emit('disconnect', reason);
      this.scheduleReconnect();
    };

    this.socket.onerror = (event) => {
      this.handleConnectionError(`WebSocket错误: ${event}`);
    };
  }

  // 处理接收到的消息
  private handleMessage(data: { event: string; data: any }) {
    if (!data.event) return;

    const handlers = this.eventHandlers[data.event];
    if (handlers && handlers.length > 0) {
      handlers.forEach(handler => handler(data.data));
    } else {
      console.warn(`未处理的事件: ${data.event}`, data.data);
    }
  }

  // 处理连接错误
  private handleConnectionError(message: string) {
    this.lastError = message;
    this.connecting = false;
    this.connected = false;

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.emit('connect_error', new Error(message));
    this.scheduleReconnect();
  }

  // 安排重连
  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('reconnect_failed');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    this.emit('reconnecting', this.reconnectAttempts);
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // 启动心跳机制
  private startHeartbeat() {
    this.sendPing();
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    this.heartbeatTimer = setInterval(() => {
      if (this.connected) {
        this.sendPing();
      }
    }, this.heartbeatInterval);
  }

  // 发送ping消息
  private sendPing() {
    this.lastPingTime = Date.now();

    if (this.socket) {
      try {
        // 发送自定义ping消息
        this.emit('ping', { timestamp: this.lastPingTime });

        // 设置ping超时检测
        setTimeout(() => {
          const timeSinceLastPing = Date.now() - this.lastPingTime;
          if (timeSinceLastPing > this.pingTimeout && this.connected) {
            this.socket?.close(1006, 'Ping timeout');
          }
        }, this.pingTimeout);
      } catch (error) {
        console.error('发送ping失败:', error);
      }
    }
  }

  // 获取断开连接原因
  private getDisconnectReason(event: CloseEvent): DisconnectReason {
    if (event.code === 1000) return 'io client disconnect';
    if (event.code === 1001) return 'transport close';
    if (event.code === 1006) return 'ping timeout';
    return 'transport error';
  }
  // 新增：清理所有事件监听器和定时器
  private clearResources() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.close();
      this.socket = null;
    }

    // 清空事件处理器
    this.eventHandlers = {};
  }
}

// Vue3组合式函数封装
export const useSocket = (url: string | Ref<string>, options: {
  query?: Record<string, string>;
  autoConnect?: boolean;
} = {}) => {
  const socketRef = ref<Socket | null>(null);
  const connected = ref(false);
  const connecting = ref(false);
  const lastError = ref<string | null>(null);

  const autoConnect = options.autoConnect !== undefined ? options.autoConnect : true;

  // 初始化Socket
  const initSocket = () => {
    const socketUrl = typeof url === 'string' ? url : url.value;
    socketRef.value = new Socket(socketUrl, {
      query: options.query,
    });

    // 监听连接状态变化
    socketRef.value.on('connect', () => {
      connected.value = true;
      connecting.value = false;
      lastError.value = null;
    });

    socketRef.value.on('connecting', () => {
      connecting.value = true;
    });

    socketRef.value.on('connect_error', (error: Error) => {
      connecting.value = false;
      lastError.value = error.message;
    });

    socketRef.value.on('disconnect', (reason: DisconnectReason) => {
      connected.value = false;
      connecting.value = false;
      if (reason !== 'io client disconnect') {
        lastError.value = `连接断开: ${reason}`;
      }
    });

    // 自动连接
    if (autoConnect && !connecting.value && !connected.value) {
      socketRef.value.connect();
    }
  };

  // 连接到服务器
  const connect = () => {
    socketRef.value?.connect();
  };

  // 断开连接
  const disconnect = () => {
    socketRef.value?.disconnect();
  };

  // 发送消息
  const emit = (event: string, data: any = {}) => {
    return socketRef.value?.emit(event, data);
  };

  // 监听事件
  const on = (event: string, handler: EventHandler) => {
    socketRef.value?.on(event, handler);
    return () => off(event, handler); // 返回取消监听函数
  };

  // 取消监听事件
  const off = (event: string, handler?: EventHandler) => {
    socketRef.value?.off(event, handler);
  };

  // 监听一次事件
  const once = (event: string, handler: EventHandler) => {
    socketRef.value?.once(event, handler);
  };

  // 初始化
  if (typeof url === 'string') {
    initSocket();
  } else {
    // 监听URL变化
    watchEffect(() => {
      disconnect();
      initSocket();
    });
  }

  // 组件卸载时断开连接
  onUnmounted(() => {
    disconnect();
  });

  return {
    socket: computed(() => socketRef.value),
    connected,
    connecting,
    lastError,
    connect,
    disconnect,
    emit,
    on,
    off,
    once,
  };
};