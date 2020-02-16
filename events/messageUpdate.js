module.exports = class {
  constructor(client) {
    this.client = client;
  }

  run(oldMessage, newMessage) {
    this.client.emit("message", newMessage);
  }
};
