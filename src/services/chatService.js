import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from './config';
import { SOCKET_EVENTS } from './events';
import { notify } from './notifications';

class ChatService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
  }

  connect(currentUser) {  
    try {
      this.socket = io(SOCKET_CONFIG.SERVER_URL, {
        reconnection: true,
        reconnectionAttempts: SOCKET_CONFIG.RECONNECT_ATTEMPTS,
        timeout: SOCKET_CONFIG.TIMEOUT,
      });

      this.setupEventListeners(currentUser);
      return this.socket;
    } catch (error) {
      notify.error('Error connecting to chat server');
      console.error('Connection error:', error);
      return null;
    }
  }

  setupEventListeners(currentUser) {
    this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, this.handleConnectError.bind(this));
    this.socket.on(SOCKET_EVENTS.CONNECT, () => this.handleConnect(currentUser));
    this.socket.on(SOCKET_EVENTS.DISCONNECT, this.handleDisconnect.bind(this));
  }

  handleConnectError() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts >= SOCKET_CONFIG.RECONNECT_ATTEMPTS) {
      notify.error('Unable to connect to chat server. Please try again later.');
      this.disconnect();
    }
  }

  handleConnect(currentUser) {
    this.reconnectAttempts = 0;
    this.socket.emit(SOCKET_EVENTS.USER_JOIN, currentUser);
    notify.success('Connected to chat server');
  }

  handleDisconnect() {
    notify.warn('Disconnected from chat server');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(to, message) {
    if (!this.isConnected()) {
      notify.error('Not connected to chat server');
      return;
    }
    
    this.socket.emit(SOCKET_EVENTS.MESSAGE_PRIVATE, { to, message });
  }

  isConnected() {
    return this.socket?.connected;
  }
}

export default new ChatService();