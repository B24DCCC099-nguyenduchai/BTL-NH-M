const jwt = require('jsonwebtoken');
const { User } = require('../models');
const jwtConfig = require('../config/jwt');
const { hashPassword, comparePassword } = require('../utils/password');

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }
    const user = await User.create({
      name,
      email,
      passwordHash: hashPassword(password),
      role: role || 'student',
    });
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !comparePassword(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }
    if (user.status === 'locked') {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa.' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res) {
  res.json({ message: 'Logged out' });
}

async function profile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'role', 'status', 'department', 'faculty', 'class'] });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res) {
  res.json({ message: 'Reset password flow is not implemented yet.' });
}

module.exports = { register, login, logout, profile, resetPassword };
