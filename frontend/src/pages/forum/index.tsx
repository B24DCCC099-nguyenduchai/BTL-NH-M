import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'umi';
import PostCard from '../../components/forum/PostCard';
import TagBadge from '../../components/common/TagBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { forumService } from '../../services/forumService';
import type { Post, Tag, SortOption } from '../../types';

interface Props { currentUser: any; }

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'newest', label: 'Mới nhất' },
  { key: 'hot', label: '🔥 Nổi bật' },
  { key: 'votes', label: '▲ Vote cao' },
  { key: 'views', label: '👁 Xem nhiều' },
];

const ForumPage: React.FC<Props> = ({ currentUser }) => {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams((location as any).search);
  const initKeyword = params.get('keyword') ?? '';
  const initTag = params.get('tag') ?? null;

  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('newest');
  const [keyword, setKeyword] = useState(initKeyword);
  const [activeTag, setActiveTag] = useState<string | null>(initTag);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pr, tr] = await Promise.all([
          forumService.getPosts({ page, sort, tag: activeTag ?? undefined, keyword: keyword || undefined, limit: 10 }),
          forumService.getTopTags(15),
        ]);
        setPosts(pr.data);
        setTotalPages(pr.pagination.totalPages);
        setTotal(pr.pagination.total);
        setTags(tr);
      } catch { /* empty */ }
      finally { setLoading(false); }
    };
    load();
  }, [page, sort, activeTag, keyword]);

  const inp: React.CSSProperties = {
    width:'100%', height:44, border:'1.5px solid var(--border)', borderRadius:8,
    padding:'0 14px', background:'var(--bg)', color:'var(--text)', fontSize:14,
    outline:'none', fontFamily:'inherit', transition:'all .2s',
  };

  return (
    <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:28, marginBottom:4 }}>📝 Diễn đàn thảo luận</h1>
          {total > 0 && <div style={{ fontSize:14, color:'var(--muted)' }}>{total.toLocaleString()} bài viết</div>}
        </div>
        {currentUser && (
          <button onClick={() => history.push('/ask')} style={{ display:'inline-flex',alignItems:'center',gap:6,padding:'0 20px',height:42,borderRadius:21,fontSize:14,fontWeight:600,cursor:'pointer',border:'none',background:'linear-gradient(135deg,var(--pri),var(--sec))',color:'#fff',fontFamily:'inherit' }}>
            ✏️ Đặt câu hỏi mới
          </button>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:28, alignItems:'start' }}>
        {/* Main */}
        <div>
          {/* Search & sort */}
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:16, marginBottom:20 }}>
            <div style={{ position:'relative', marginBottom:14 }}>
              <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--faint)', fontSize:15, pointerEvents:'none' }}>🔍</span>
              <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo từ khóa..."
                style={{ ...inp, paddingLeft:38 }}
                onFocus={e => { e.target.style.borderColor='var(--pri)'; e.target.style.boxShadow='0 0 0 3px rgba(79,140,255,.1)'; }}
                onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow=''; }} />
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
              <span style={{ fontSize:13, color:'var(--muted)', fontWeight:500 }}>Sắp xếp:</span>
              {SORT_OPTIONS.map(s => (
                <button key={s.key} onClick={() => { setSort(s.key); setPage(1); }}
                  style={{ padding:'5px 14px', borderRadius:20, fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit',
                    border:`1.5px solid ${sort===s.key?'var(--pri)':'var(--border)'}`,
                    background:sort===s.key?'rgba(79,140,255,.08)':'transparent',
                    color:sort===s.key?'var(--pri)':'var(--muted)', transition:'all .15s' }}>
                  {s.label}
                </button>
              ))}
              {activeTag && (
                <button onClick={() => { setActiveTag(null); setPage(1); }} style={{ padding:'5px 12px', borderRadius:20, fontSize:13, cursor:'pointer', border:'1.5px solid var(--danger)', color:'var(--danger)', background:'rgba(239,68,68,.06)', fontFamily:'inherit' }}>
                  ✕ #{activeTag}
                </button>
              )}
            </div>
          </div>

          {loading ? <LoadingSpinner /> : posts.length ? (
            <>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {posts.map(p => <PostCard key={p.id} post={p} />)}
              </div>
              {totalPages > 1 && (
                <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:28 }}>
                  <button disabled={page===1} onClick={() => setPage(p=>p-1)} style={{ padding:'8px 16px', borderRadius:8, border:'1.5px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:page===1?'not-allowed':'pointer', opacity:page===1?.4:1, fontFamily:'inherit', fontSize:14 }}>← Trước</button>
                  {Array.from({length:Math.min(totalPages,7)},(_,i)=>i+1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{ width:36, height:36, borderRadius:8, border:`1.5px solid ${page===p?'var(--pri)':'var(--border)'}`, background:page===p?'rgba(79,140,255,.08)':'transparent', color:page===p?'var(--pri)':'var(--muted)', cursor:'pointer', fontWeight:page===p?600:400, fontFamily:'inherit', fontSize:14 }}>{p}</button>
                  ))}
                  <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} style={{ padding:'8px 16px', borderRadius:8, border:'1.5px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:page===totalPages?'not-allowed':'pointer', opacity:page===totalPages?.4:1, fontFamily:'inherit', fontSize:14 }}>Sau →</button>
                </div>
              )}
            </>
          ) : (
            <EmptyState icon="🔍" title="Không tìm thấy kết quả" description={keyword ? `Không có bài viết nào khớp với "${keyword}"` : 'Chưa có bài viết nào'} />
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:80 }}>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:18 }}>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.5px', color:'var(--muted)', textTransform:'uppercase', marginBottom:14 }}>🏷️ Lọc theo chủ đề</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {tags.map(t => (
                <TagBadge key={t.id} tag={t} active={activeTag===t.name}
                  onClick={() => { setActiveTag(activeTag===t.name?null:t.name); setPage(1); }} />
              ))}
            </div>
          </div>

          {currentUser && (
            <div style={{ background:'linear-gradient(135deg,var(--pri),var(--sec))', borderRadius:'var(--radius)', padding:20, textAlign:'center' }}>
              <div style={{ fontSize:24, marginBottom:8 }}>💡</div>
              <div style={{ color:'#fff', fontWeight:600, fontSize:15, marginBottom:6 }}>Có thắc mắc?</div>
              <div style={{ color:'rgba(255,255,255,.8)', fontSize:13, marginBottom:14 }}>Đặt câu hỏi và nhận câu trả lời từ cộng đồng!</div>
              <button onClick={() => history.push('/ask')} style={{ padding:'9px 22px', borderRadius:20, border:'none', background:'#fff', color:'var(--pri)', fontWeight:600, cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>✏️ Đặt câu hỏi</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
