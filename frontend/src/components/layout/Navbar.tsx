import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import UserAvatar from '../common/UserAvatar';
import type { User } from '../../types';

interface Props {
  user: User | null;
  dark: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<Props> = ({
  user,
  dark,
  onToggleDark,
  onLogout,
}) => {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', fn);

    return () => {
      document.removeEventListener('mousedown', fn);
    };
  }, []);

  const btnGhost: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '0 18px',
    height: 38,
    borderRadius: 19,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    border: '1.5px solid var(--border)',
    background: 'transparent',
    color: 'var(--muted)',
    whiteSpace: 'nowrap',
    transition: 'all .2s',
    fontFamily: 'inherit',
  };

  const btnPrimary: React.CSSProperties = {
    ...btnGhost,
    border: 'none',
    background:
      'linear-gradient(135deg, var(--pri), var(--sec))',
    color: '#fff',
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Logo */}
        <div
          onClick={() => history.push('/')}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 20,
            background:
              'linear-gradient(135deg, var(--pri), var(--sec))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          📚 Diễn Đàn SV
        </div>

        {/* Search */}
        <div
          style={{
            flex: 1,
            maxWidth: 480,
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 13,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--faint)',
              fontSize: 15,
              pointerEvents: 'none',
            }}
          >
            🔍
          </span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                history.push(
                  `/forum?keyword=${encodeURIComponent(
                    search.trim(),
                  )}`,
                );
              }
            }}
            placeholder="Tìm kiếm bài viết..."
            style={{
              width: '100%',
              height: 40,
              border: '1.5px solid var(--border)',
              borderRadius: 20,
              padding: '0 16px 0 40px',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'all .2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--pri)';
              e.target.style.boxShadow =
                '0 0 0 3px rgba(79,140,255,.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = '';
            }}
          />
        </div>

        {/* Right actions */}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <button
            onClick={onToggleDark}
            title="Đổi chủ đề"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '1.5px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all .2s',
            }}
          >
            {dark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              {(user.role === 'student' ||
                user.role === 'lecturer') && (
                <button
                  onClick={() => history.push('/ask')}
                  style={btnPrimary}
                >
                  ✏️ Đặt câu hỏi
                </button>
              )}

              {user.role === 'admin' && (
                <button
                  onClick={() => history.push('/admin')}
                  style={btnGhost}
                >
                  ⚙️ Admin
                </button>
              )}

              {/* User dropdown */}
              <div
                style={{ position: 'relative' }}
                ref={menuRef}
              >
                <div
                  onClick={() =>
                    setMenuOpen((o) => !o)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <UserAvatar user={user} size="sm" />
                </div>

                {menuOpen && (
                  <div
                    className="scale-in"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 10px)',
                      background: 'var(--surface)',
                      border:
                        '1px solid var(--border)',
                      borderRadius: 12,
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 200,
                      minWidth: 200,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderBottom:
                          '1px solid var(--border)',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {user.username}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--muted)',
                          marginTop: 2,
                        }}
                      >
                        {user.email}
                      </div>
                    </div>

                    {[
                      {
                        label: '🏠 Trang chủ',
                        to: '/',
                      },
                      {
                        label: '👤 Hồ sơ',
                        to: '/profile',
                      },
                      ...(user.role === 'admin'
                        ? [
                            {
                              label: '⚙️ Quản trị',
                              to: '/admin',
                            },
                          ]
                        : []),
                    ].map((m, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          history.push(m.to);
                          setMenuOpen(false);
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '10px 16px',
                          fontSize: 14,
                          textAlign: 'left',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text)',
                          transition: 'background .15s',
                          fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'var(--bg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            'transparent';
                        }}
                      >
                        {m.label}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        onLogout();
                        setMenuOpen(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 16px',
                        fontSize: 14,
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        borderTop:
                          '1px solid var(--border)',
                        cursor: 'pointer',
                        color: 'var(--danger)',
                        fontFamily: 'inherit',
                        transition: 'background .15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'var(--bg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'transparent';
                      }}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  history.push('/auth/login')
                }
                style={btnGhost}
              >
                Đăng nhập
              </button>

              <button
                onClick={() =>
                  history.push('/auth/register')
                }
                style={btnPrimary}
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