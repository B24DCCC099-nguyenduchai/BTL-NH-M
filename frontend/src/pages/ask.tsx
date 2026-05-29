import React, { useState, useEffect } from 'react';
import { useNavigate } from 'umi';
import TagBadge from '../components/common/TagBadge';
import { forumService } from '../services/forumService';
import { addToast } from '../utils/toast';
import type { Tag, User } from '../types';

interface Props { currentUser: User | null; }

const AskPage: React.FC<Props> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  useEffect(() => {
    if (!currentUser) { navigate('/auth/login'); return; }
    forumService.getTags().then(setAllTags).catch(() => {});
    // Restore draft
    const draft = localStorage.getItem('forum_draft');
    if (draft) { try { const d = JSON.parse(draft); setTitle(d.title||''); setContent(d.content||''); } catch {} }
  }, [currentUser]);

  // Auto-save draft
  useEffect(() => {
    const t = setTimeout(() => { localStorage.setItem('forum_draft', JSON.stringify({ title, content })); }, 1000);
    return () => clearTimeout(t);
  }, [title, content]);

  const handleTagInput = (val: string) => {
    setTagInput(val);
    if (val.trim()) {
      setSuggestions(allTags.filter(t => t.name.toLowerCase().includes(val.toLowerCase()) && !selectedTags.find(s => s.id === t.id)));
    } else setSuggestions([]);
  };

  const addTag = (tag: Tag) => {
    if (selectedTags.length >= 10) { addToast('Tối đa 10 tags', 'warning'); return; }
    if (!selectedTags.find(t => t.id === tag.id)) setSelectedTags(p => [...p, tag]);
    setTagInput(''); setSuggestions([]);
  };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!title.trim()) e.title = 'Tiêu đề không được để trống';
    else if (title.trim().length < 5) e.title = 'Tiêu đề phải có ít nhất 5 ký tự';
    if (!content.trim()) e.content = 'Nội dung không được để trống';
    else if (content.trim().length < 10) e.content = 'Nội dung phải có ít nhất 10 ký tự';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const p = await forumService.createPost({ title: title.trim(), content: content.trim(), tags: selectedTags.map(t => t.name) });
      localStorage.removeItem('forum_draft');
      addToast('🎉 Bài viết đã được đăng thành công!', 'success');
      history.push(`/forum/${p.id}`);
    } catch { addToast('Không thể đăng bài. Vui lòng thử lại!', 'error'); }
    finally { setSubmitting(false); }
  };

  const inp: React.CSSProperties = { width:'100%', height:44, border:'1.5px solid var(--border)', borderRadius:8, padding:'0 14px', background:'var(--bg)', color:'var(--text)', fontSize:14, outline:'none', fontFamily:'inherit', transition:'all .2s' };
  const focusStyle = (e: any) => { e.target.style.borderColor='var(--pri)'; e.target.style.boxShadow='0 0 0 3px rgba(79,140,255,.1)'; };
  const blurStyle = (e: any) => { e.target.style.borderColor=errors[e.target.name]?'var(--danger)':'var(--border)'; e.target.style.boxShadow=''; };

  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'32px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, color:'var(--muted)', marginBottom:20, cursor:'pointer' }} onClick={() => history.push('/forum')}>
        ← Diễn đàn
      </div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:28, marginBottom:6 }}>✏️ Đặt câu hỏi mới</h1>
      <p style={{ color:'var(--muted)', fontSize:15, marginBottom:28 }}>Càng chi tiết, bạn càng dễ nhận được câu trả lời chính xác!</p>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:32 }}>
        {/* Title */}
        <div style={{ marginBottom:22 }}>
          <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Tiêu đề câu hỏi *</label>
          <input name="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Làm thế nào để hiểu Recursion trong lập trình?"
            style={{ ...inp, borderColor: errors.title ? 'var(--danger)' : 'var(--border)' }}
            onFocus={focusStyle} onBlur={blurStyle} maxLength={200} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            {errors.title ? <span style={{ fontSize:12, color:'var(--danger)' }}>⚠️ {errors.title}</span> : <span />}
            <span style={{ fontSize:12, color:'var(--faint)' }}>{title.length}/200</span>
          </div>
          <div style={{ height:3, borderRadius:2, background:'var(--border)', marginTop:6, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(title.length/200)*100}%`, background:'linear-gradient(90deg,var(--pri),var(--sec))', borderRadius:2, transition:'width .3s' }} />
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom:22 }}>
          <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Nội dung chi tiết *</label>
          <textarea name="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Mô tả chi tiết vấn đề bạn gặp phải. Bạn đã thử những cách nào? Code bạn đang viết là gì?..."
            style={{ width:'100%', minHeight:220, border:`1.5px solid ${errors.content?'var(--danger)':'var(--border)'}`, borderRadius:8, padding:'12px 14px', background:'var(--bg)', color:'var(--text)', fontSize:14, fontFamily:'inherit', resize:'vertical', outline:'none', lineHeight:1.7, transition:'all .2s' }}
            onFocus={focusStyle} onBlur={blurStyle} maxLength={5000} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            {errors.content ? <span style={{ fontSize:12, color:'var(--danger)' }}>⚠️ {errors.content}</span> : <span />}
            <span style={{ fontSize:12, color:'var(--faint)' }}>{content.length}/5000</span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom:28, position:'relative' }}>
          <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Tags (chủ đề liên quan)</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'8px 12px', border:'1.5px solid var(--border)', borderRadius:8, background:'var(--bg)', minHeight:48, alignItems:'center', cursor:'text' }}>
            {selectedTags.map(t => (
              <TagBadge key={t.id} tag={t} onClick={() => setSelectedTags(p => p.filter(x => x.id !== t.id))} style={{ cursor:'pointer' }} />
            ))}
            <input value={tagInput} onChange={e => handleTagInput(e.target.value)}
              onKeyDown={e => { if (e.key==='Enter' && tagInput.trim()) { const ex = allTags.find(t => t.name.toLowerCase()===tagInput.toLowerCase()); addTag(ex ?? { id: Date.now(), name: tagInput, color:'#7b61ff', usageCount:0 }); } }}
              placeholder={selectedTags.length===0?'Nhập để tìm hoặc thêm tag...':''} style={{ border:'none', outline:'none', background:'transparent', fontSize:14, color:'var(--text)', flex:1, minWidth:140, fontFamily:'inherit', padding:'2px 0' }} />
          </div>
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, zIndex:50, boxShadow:'var(--shadow-lg)', maxHeight:200, overflowY:'auto' }}>
              {suggestions.slice(0,8).map(t => (
                <div key={t.id} onClick={() => addTag(t)} style={{ padding:'10px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontSize:14, transition:'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='var(--bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                  <TagBadge tag={t} />
                  <span style={{ color:'var(--faint)', fontSize:13 }}>{t.usageCount} bài viết</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize:12, color:'var(--faint)', marginTop:6 }}>Nhấn Enter để thêm. Tối đa 10 tags. ({selectedTags.length}/10)</div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:12, justifyContent:'flex-end', paddingTop:20, borderTop:'1px solid var(--border)' }}>
          <button onClick={() => { localStorage.removeItem('forum_draft'); history.push('/forum'); }}
            style={{ padding:'0 22px', height:42, borderRadius:21, border:'1.5px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>
            Hủy bỏ
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            style={{ padding:'0 28px', height:42, borderRadius:21, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:submitting?'not-allowed':'pointer', fontSize:14, fontWeight:600, fontFamily:'inherit', opacity:submitting?.75:1 }}>
            {submitting ? 'Đang đăng...' : '📤 Đăng bài viết'}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:20, marginTop:20 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>💡 Tips để nhận câu trả lời tốt hơn</div>
        {['Mô tả vấn đề cụ thể, rõ ràng', 'Chia sẻ code hoặc ví dụ bạn đã thử', 'Nêu rõ lỗi hoặc kết quả mong muốn', 'Chọn đúng tags để tìm đúng người'].map((tip,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--muted)', marginBottom:8 }}>
            <span style={{ color:'var(--success)', fontSize:15 }}>✓</span> {tip}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AskPage;
