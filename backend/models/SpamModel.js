const fs = require('fs-extra');
const path = require('path');

class SpamModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/spam-checks.json');
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

  async saveCheck(check) {
    const checks = await this.getChecks();
    checks.push({
      id: Date.now(),
      ...check,
      timestamp: new Date().toISOString()
    });
    await fs.writeJson(this.dataPath, checks);
    return check;
  }

  async getChecks(limit = 50) {
    try {
      const checks = await fs.readJson(this.dataPath);
      return checks.slice(-limit).reverse();
    } catch {
      return [];
    }
  }

  async getStats() {
    const checks = await this.getChecks();
    const total = checks.length;
    const spam = checks.filter(c => c.isSpam).length;
    const ham = total - spam;
    
    return {
      total,
      spam,
      ham,
      spamPercentage: total ? (spam / total * 100).toFixed(2) : 0
    };
  }
}

module.exports = SpamModel;