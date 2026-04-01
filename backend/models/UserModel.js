const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/users.json');
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

  async createUser(userData) {
    const users = await this.getUsers();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true
    };

    users.push(newUser);
    await fs.writeJson(this.dataPath, users);
    
    // Remove password from returned object
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async getUsers() {
    try {
      return await fs.readJson(this.dataPath);
    } catch {
      return [];
    }
  }

  async getUserById(id) {
    const users = await this.getUsers();
    const user = users.find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async getUserByEmail(email) {
    const users = await this.getUsers();
    return users.find(u => u.email === email);
  }

  async validatePassword(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    // Update last login
    await this.updateUser(user.id, { lastLogin: new Date().toISOString() });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id, updates) {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return null;
    }

    // Don't allow password update through this method
    delete updates.password;
    
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await fs.writeJson(this.dataPath, users);
    
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  }

  async deleteUser(id) {
    const users = await this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    await fs.writeJson(this.dataPath, filtered);
    return true;
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return null;
    }
  }
}

module.exports = UserModel;