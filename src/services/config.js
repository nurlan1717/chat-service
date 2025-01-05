export const SOCKET_CONFIG = {
  SERVER_URL: process.env.SOCKET_SERVER_URL || 'http://localhost:3001',
  RECONNECT_ATTEMPTS: 3,
  TIMEOUT: 10000,
};