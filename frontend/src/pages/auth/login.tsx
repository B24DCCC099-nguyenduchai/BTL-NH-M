import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() || !password) { setError('Vui lòng nhập đầy đủ thông tin'); return; }
    setLoading(true); setError('');
    try {
      await login({ email, password });
    } catch (e) { 
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Email hoặc mật khẩu không chính xác');
    } finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width:'100%', height:46, border:'1.5px solid var(--border)', borderRadius:8, padding:'0 14px', background:'var(--bg)', color:'var(--text)', fontSize:15, outline:'none', fontFamily:'inherit', transition:'all .2s' };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'linear-gradient(135deg,rgba(79,140,255,.06),rgba(123,97,255,.06))' }}>
      <div style={{ width:'100%', maxWidth:440, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:40, boxShadow:'var(--shadow-lg)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, background:'linear-gradient(135deg,var(--pri),var(--sec))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:8 }}>📚 Diễn Đàn SV</div>
          <div style={{ color:'var(--muted)', fontSize:15 }}>Chào mừng trở lại!</div>
        </div>

        {error && (
          <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.3)', borderRadius:8, padding:'10px 14px', fontSize:14, color:'var(--danger)', marginBottom:18 }}>⚠️ {error}</div>
        )}

        <div style={{ marginBottom:18 }}>
          <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Email hoặc tên đăng nhập</label>
          <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==='Enter'&&handleSubmit()} placeholder="email@student.edu.vn" style={inp}
            onFocus={e => { e.target.style.borderColor='var(--pri)'; e.target.style.boxShadow='0 0 0 3px rgba(79,140,255,.1)'; }}
            onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow=''; }} />
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Mật khẩu</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==='Enter'&&handleSubmit()} placeholder="••••••••" style={inp}
            onFocus={e => { e.target.style.borderColor='var(--pri)'; e.target.style.boxShadow='0 0 0 3px rgba(79,140,255,.1)'; }}
            onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow=''; }} />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', height:48, borderRadius:24, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:loading?'not-allowed':'pointer', fontSize:16, fontWeight:600, fontFamily:'inherit', opacity:loading?.75:1, transition:'all .2s' }}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập →'}
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:12, color:'var(--faint)', fontSize:13, margin:'20px 0' }}>
          <div style={{ flex:1, height:1, background:'var(--border)' }} />hoặc<div style={{ flex:1, height:1, background:'var(--border)' }} />
        </div>

        <div style={{ textAlign:'center', fontSize:14, color:'var(--muted)' }}>
          Chưa c
          <span onClick={() => window.location.href = '/auth/register'} style={{ color:'var(--pri)', fontWeight:600, cursor:'pointer' }}>Đăng ký ngay</span>
        </div>

        <div style={{ marginTop:20, padding:14, background:'var(--bg)', borderRadius:8, fontSize:13, color:'var(--faint)' }}>
          <strong>Demo:</strong> email bất kỳ / mật khẩu <code>123456</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
