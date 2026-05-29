import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import PostCard from '../components/forum/PostCard';
import TagBadge from '../components/common/TagBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { forumService } from '../services/forumService';
import { useAuth } from '../hooks/useAuth';
import type { Post, Tag, SortOption } from '../types';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'hot', label: '🔥 Nổi bật' },
  { key: 'votes', label: '▲ Vote cao' },
  { key: 'views', label: '👁 Xem nhiều' },
];

export default function HomePage() {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [postsRes, tagsRes] = await Promise.all([
          forumService.getPosts({ page, sort, tag: activeTag ?? undefined, limit: 10 }),
          forumService.getTopTags(12),
        ]);
        setPosts(postsRes.data);
        setTotalPages(postsRes.pagination.totalPages);
        setTags(tagsRes);
      } catch { /* empty */ }
      finally { setLoading(false); }
    };
    load();
  }, [page, sort, activeTag]);

  const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

      {/* Hero */}
      <div style={{ borderRadius: 20, background: 'linear-gradient(135deg,#1e3a5f 0%,#2d1b69 55%,#1a3a4f 100%)', padding: '52px 48px', marginBottom: 36, position: 'relative', overflow: 'hidden' }}>
        {[{t:-60,r:-60,s:200,o:.05},{t:40,r:160,s:80,o:.07},{b:-40,l:-40,s:160,o:.04}].map((c:{t?:number;r?:number;b?:number;l?:number;s:number;o:number},i) => (
          <div key={i} style={{ position:'absolute', width:c.s, height:c.s, borderRadius:'50%', background:'#fff', opacity:c.o, top:c.t, bottom:c.b, left:c.l, right:c.r }} />
        ))}
        <div style={{ position:'relative' }}>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:40, fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:12 }}>
            📚 Diễn đàn Hỏi Đáp<br/>Sinh viên
          </h1>
          <p style={{ color:'rgba(255,255,255,.75)', fontSize:17, marginBottom:28 }}>Chia sẻ kiến thức · Giải đáp thắc mắc · Học hỏi cùng nhau</p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:36 }}>
            {currentUser ? (
              <button onClick={() => history.push('/ask')} style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'0 28px',height:48,borderRadius:24,fontSize:16,fontWeight:600,cursor:'pointer',border:'none',background:'#fff',color:'#1e3a5f',fontFamily:'inherit' }}>✏️ Đặt câu hỏi ngay</button>
            ) : (
              <>
                <button onClick={() => history.push('/auth/register')} style={{ display:'inline-flex',alignItems:'center',padding:'0 28px',height:48,borderRadius:24,fontSize:16,fontWeight:600,cursor:'pointer',border:'none',background:'#fff',color:'#1e3a5f',fontFamily:'inherit' }}>Tham gia ngay</button>
                <button onClick={() => history.push('/auth/login')} style={{ display:'inline-flex',alignItems:'center',padding:'0 28px',height:48,borderRadius:24,fontSize:16,fontWeight:600,cursor:'pointer',border:'1.5px solid rgba(255,255,255,.35)',background:'rgba(255,255,255,.12)',color:'#fff',fontFamily:'inherit' }}>Đăng nhập</button>
              </>
            )}
          </div>
          <div style={{ display:'flex', gap:36, flexWrap:'wrap' }}>
            {[{num:'2,341',label:'Bài viết'},{num:'1,234',label:'Thành viên'},{num:'8,567',label:'Bình luận'},{num:'48',label:'Chủ đề'}].map((s,i) => (
              <div key={i}>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:'#fff' }}>{s.num}</div>
                <div style={{ fontSize:13,color:'rgba(255,255,255,.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:32, alignItems:'start' }}>

        {/* Posts col */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20 }}>
              {activeTag ? `🏷️ #${activeTag}` : '🔥 Bài viết mới nhất'}
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {SORT_OPTIONS.map(s => (
                <button key={s.key} onClick={() => { setSort(s.key); setPage(1); }}
                  style={{ padding:'6px 14px', borderRadius:20, fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit',
                    border:`1.5px solid ${sort===s.key?'var(--pri)':'var(--border)'}`,
                    background: sort===s.key ? 'rgba(79,140,255,.08)' : 'transparent',
                    color: sort===s.key ? 'var(--pri)' : 'var(--muted)', transition:'all .15s' }}>
                  {s.label}
                </button>
              ))}
              {activeTag && (
                <button onClick={() => setActiveTag(null)} style={{ padding:'6px 12px', borderRadius:20, fontSize:13, cursor:'pointer', border:'1.5px solid var(--danger)', color:'var(--danger)', background:'rgba(239,68,68,.06)', fontFamily:'inherit' }}>
                  ✕ {activeTag}
                </button>
              )}
            </div>
          </div>

          {loading ? <LoadingSpinner text="Đang tải bài viết..." /> : posts.length ? (
            <>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {posts.map(p => <PostCard key={p.id} post={p} />)}
              </div>
              {totalPages > 1 && (
                <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:32 }}>
                  <button disabled={page===1} onClick={() => setPage(p=>p-1)} style={{ padding:'8px 18px', borderRadius:8, border:'1.5px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:page===1?'not-allowed':'pointer', opacity:page===1?.4:1, fontFamily:'inherit', fontSize:14 }}>← Trước</button>
                  {Array.from({length:Math.min(totalPages,5)},(_,i)=>i+1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{ width:38, height:38, borderRadius:8, border:`1.5px solid ${page===p?'var(--pri)':'var(--border)'}`, background:page===p?'rgba(79,140,255,.08)':'transparent', color:page===p?'var(--pri)':'var(--muted)', cursor:'pointer', fontWeight:page===p?600:400, fontFamily:'inherit', fontSize:14 }}>{p}</button>
                  ))}
                  <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} style={{ padding:'8px 18px', borderRadius:8, border:'1.5px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:page===totalPages?'not-allowed':'pointer', opacity:page===totalPages?.4:1, fontFamily:'inherit', fontSize:14 }}>Sau →</button>
                </div>
              )}
            </>
          ) : (
            <EmptyState icon="📭" title="Chưa có bài viết nào" description="Hãy là người đầu tiên đặt câu hỏi!"
              action={currentUser && <button onClick={() => navigate('/ask')} style={{ marginTop:16, padding:'10px 24px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:'pointer', fontSize:14, fontWeight:500, fontFamily:'inherit' }}>✏️ Đặt câu hỏi</button>} />
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:20, position:'sticky', top:80 }}>
          <div style={card}>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.5px', color:'var(--muted)', textTransform:'uppercase', marginBottom:12 }}>🏷️ Chủ đề</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {tags.map(t => (
                <TagBadge key={t.id} tag={t} active={activeTag===t.name}
                  onClick={() => { setActiveTag(activeTag===t.name?null:t.name); setPage(1); }} />
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.5px', color:'var(--muted)', textTransform:'uppercase', marginBottom:12 }}>🚀 Khám phá</div>
            {[
              {label:'📝 Tất cả bài viết', to:'/forum'},
              ...(currentUser
                ? [{label:'✏️ Đặt câu hỏi', to:'/ask'},{label:'👤 Hồ sơ', to:'/profile'}]
                : [{label:'🔑 Đăng nhập', to:'/auth/login'},{label:'📋 Đăng ký', to:'/auth/register'}])
            ].map((l:{label:string;to:string},i) => (
              <button key={i} onClick={() => navigate(l.to)}
                style={{ display:'block', width:'100%', padding:'9px 12px', fontSize:14, textAlign:'left', background:'transparent', border:'none', cursor:'pointer', color:'var(--text)', borderRadius:8, transition:'background .15s', fontFamily:'inherit', marginBottom:2 }}
                onMouseEnter={e => (e.currentTarget.style.background='var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
