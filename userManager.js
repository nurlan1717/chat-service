class UserManager {
  constructor() {
    this.activeUsers = new Map();
  }

  addUser(socketId, user) {
    this.activeUsers.set(socketId, { ...user, socketId });
    return this.getActiveUsers();
  }

  removeUser(socketId) {
    this.activeUsers.delete(socketId);
    return this.getActiveUsers();
  }

  getActiveUsers() {
    return Array.from(this.activeUsers.values());
  }
}

export default new UserManager();