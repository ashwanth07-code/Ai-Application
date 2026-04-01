const fs = require('fs-extra');
const path = require('path');

class ChatModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/chats.json');
    this.ensureFile();
  }

  async ensureFile() {
    await fs.ensureFile(this.dataPath);
    try {
      const content = await fs.readJson(this.dataPath);
      if (!Array.isArray(content)) {
        await fs.writeJson(this.dataPath, []);
      }
    } catch {
      await fs.writeJson(this.dataPath, []);
    }
  }

  async saveChat(chat) {
    const chats = await this.getChats();
    chats.push({
      id: Date.now(),
      ...chat,
      timestamp: new Date().toISOString()
    });
    await fs.writeJson(this.dataPath, chats);
    return chat;
  }

  async getChats(limit = 50) {
    try {
      const chats = await fs.readJson(this.dataPath);
      return chats.slice(-limit).reverse();
    } catch {
      return [];
    }
  }

  async deleteChat(id) {
    const chats = await this.getChats();
    const filtered = chats.filter(chat => chat.id !== id);
    await fs.writeJson(this.dataPath, filtered);
    return filtered;
  }
}

module.exports = ChatModel;