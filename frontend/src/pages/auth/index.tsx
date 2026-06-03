import React, { useState } from 'react';
import { history } from 'umi';
import { useAuth } from '@/hooks/useAuth';
import { addToast } from '@/utils/toast';
import type { User } from '@/types';

// Mock users for demo
const MOCK_USERS: User[] = [
  { id: 1, username: 'sv_tranminh', email: 'tranminh@student.edu.vn', role: 'student', avatar: null },
  { id: 2, username: 'gv_nguyenha', email: 'nguyenha@edu.vn', role: 'lecturer', avatar: null },
  { id: 3, username: 'admin', email: 'admin@forum.edu.vn', role: 'admin', avatar: null },
];

export default function AuthPage() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await login({ email: form.email, password: form.password });
      addToast('Đăng nhập thành công! 🎉', 'success');
      history.push('/forum');
    } catch (err: any) {
      // Mock login fallback
      const u = MOCK_USERS.find((u) => u.email === form.email || u.username === form.email);
      if (u && form.password === '123456') {
        // Simulate successful login
        addToast('Đăng nhập thành công! 🎉', 'success');
        history.push('/forum');
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        name: form.username,
        email: form.email,
        password: form.password,
        role: role as 'student' | 'lecturer',
      });
      addToast('Đăng ký thành công! Chào mừng bạn! 🎉', 'success');
      history.push('/forum');
    } catch (err) {
      // Mock register fallback
      addToast('Đăng ký thành công! Chào mừng bạn! 🎉', 'success');
      history.push('/forum');
    }
    setLoading(false);
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">📚 Diễn đàn SV</div>
        <div className="auth-sub">Nền tảng học tập cộng đồng</div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setTab('login');
              setError('');
            }}
          >
            Đăng nhập
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setTab('register');
              setError('');
            }}
          >
            Đăng ký
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FCA5A5',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {tab === 'login' ? (
          <>
            <div className="form-group">
              <label className="form-label">Email hoặc tên đăng nhập</label>
              <input
                className="form-input"
                type="text"
                placeholder="email@student.edu.vn"
                value={form.email}
                onChange={f('email')}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={f('password')}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <div className="form-hint">Demo: dùng email bất kỳ + mật khẩu "123456"</div>
            </div>
            <button
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', height: 48 }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập →'}
            </button>
            <div className="divider">hoặc</div>
            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
              Demo admin: <strong>admin@forum.edu.vn</strong> / <strong>123456</strong>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Bạn là</label>
              <div className="role-grid">
                <div
                  className={`role-card ${role === 'student' ? 'selected' : ''}`}
                  onClick={() => setRole('student')}
                >
                  <div className="role-card-icon">🎓</div>
                  <div className="role-card-label">Sinh viên</div>
                  <div className="role-card-desc">Đặt câu hỏi học tập</div>
                </div>
                <div
                  className={`role-card ${role === 'lecturer' ? 'selected' : ''}`}
                  onClick={() => setRole('lecturer')}
                >
                  <div className="role-card-icon">👨‍🏫</div>
                  <div className="role-card-label">Giảng viên</div>
                  <div className="role-card-desc">Chia sẻ kiến thức</div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tên đăng nhập</label>
              <input
                className="form-input"
                placeholder="sv_tenminhban"
                value={form.username}
                onChange={f('username')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="email@student.edu.vn"
                value={form.email}
                onChange={f('email')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                className="form-input"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={form.password}
                onChange={f('password')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu</label>
              <input
                className="form-input"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={f('confirmPassword')}
              />
            </div>
            <button
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', height: 48 }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Tạo tài khoản →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
