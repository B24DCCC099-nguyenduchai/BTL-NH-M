import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'umi';
import { Avatar } from '@/components/forum';
import type { User } from '@/types';

interface Props {
  user: User | null;
  dark: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<Props> = ({
  user,
  dark,
  onToggleDark,
  onLogout,
  onSearch,
}) => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(search);
    }
    setSearch('');
  }, [search, onSearch]);

  const handleLogout = useCallback(() => {
    setUserMenuOpen(false);
    localStorage.removeItem('forum_token');
    if (onLogout) {
      onLogout();
    }
    navigate('/auth');
  }, [navigate, onLogout]);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="logo" onClick={() => navigate('/forum')} style={{ cursor: 'pointer' }}>
          📚 Diễn đàn SV
        </div>

        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="nav-right">
          {/* Dark mode toggle */}
          <button
            className="btn-icon"
            onClick={onToggleDark}
            title="Đổi chủ đề"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '1.5px solid var(--border)',
              background: 'transparent',
              color: 'var(--text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              transition: 'all .2s',
            }}
          >
            {dark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              {(user.role === 'student' || user.role === 'lecturer') && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/forum/ask')}
                >
                  ✏️ Đặt câu hỏi
                </button>
              )}

              {user.role === 'admin' && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate('/admin')}
                >
                  ⚙️ Admin
                </button>
              )}

              <div style={{ position: 'relative' }} ref={ref}>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => setUserMenuOpen((o) => !o)}
                >
                  <Avatar username={user.name} />
                </div>
                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 200,
                      minWidth: 200,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {user.email}
                      </div>
                    </div>
                    {[
                      {
                        label: '🏠 Trang chủ',
                        action: () => navigate('/forum'),
                      },
                      {
                        label: '👤 Hồ sơ của tôi',
                        action: () => navigate('/user/profile'),
                      },
                      user.role === 'admin' && {
                        label: '⚙️ Quản trị',
                        action: () => navigate('/admin'),
                      },
                      {
                        label: '🚪 Đăng xuất',
                        action: handleLogout,
                        danger: true,
                      },
                    ]
                      .filter(Boolean)
                      .map((item: any, i) => (
                        <button
                          key={i}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 16px',
                            fontSize: 14,
                            textAlign: 'left',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: item.danger ? 'var(--danger)' : 'var(--text)',
                            transition: 'background .15s',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = 'var(--bg)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = 'transparent')
                          }
                          onClick={() => {
                            item.action();
                            setUserMenuOpen(false);
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/auth')}
              >
                Đăng nhập
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/auth')}
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;