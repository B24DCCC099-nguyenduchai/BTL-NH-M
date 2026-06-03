import React, { useState, useEffect } from 'react';
import { useNavigate } from 'umi';
import { Avatar, TagBadge, RoleBadge, PostCard, Loading, EmptyState } from '@/components/forum';
import { timeAgo } from '@/utils/forum';
import { forumAPI } from '@/services/forum-api';
import type { Tag } from '@/types';

const MOCK_TAGS: Tag[] = [
  { id: 1, name: 'Lập trình', color: '#4F8CFF', usageCount: 45 },
  { id: 2, name: 'React', color: '#61DAFB', usageCount: 38 },
  { id: 3, name: 'Thuật toán', color: '#7B61FF', usageCount: 32 },
  { id: 4, name: 'SQL', color: '#4DE2E2', usageCount: 28 },
  { id: 5, name: 'JavaScript', color: '#F7DF1E', usageCount: 52 },
  { id: 6, name: 'Frontend', color: '#FF6B6B', usageCount: 41 },
  { id: 7, name: 'Database', color: '#22C55E', usageCount: 35 },
  { id: 8, name: 'Git', color: '#F34F29', usageCount: 27 },
];

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function AskPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', tags: [] });
  const [allTags, setAllTags] = useState(MOCK_TAGS);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts((p) => [...p, { message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.message !== message)), 3000);
  };

  useEffect(() => {
    (async () => {
      try {
        const r = await forumAPI.getTags();
        if (r?.data) setAllTags(r.data);
      } catch (e) {
        console.log('Using mock tags');
      }
    })();
  }, []);

  const addTag = (tag: Tag) => {
    if (!form.tags.find((t) => t.id === tag.id) && form.tags.length < 10) {
      setForm((p) => ({ ...p, tags: [...p.tags, tag] }));
    }
    setTagInput('');
    setSuggestions([]);
  };

  const handleTagInput = (v: string) => {
    setTagInput(v);
    if (v.length > 0) {
      setSuggestions(
        allTags.filter(
          (t) =>
            t.name.toLowerCase().includes(v.toLowerCase()) &&
            !form.tags.find((ft) => ft.id === t.id)
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      addToast('Vui lòng nhập tiêu đề', 'error');
      return;
    }
    if (!form.content.trim()) {
      addToast('Vui lòng nhập nội dung', 'error');
      return;
    }

    setLoading(true);
    try {
      const r = await forumAPI.createPost({
        title: form.title,
        content: form.content,
        tags: form.tags.map((t) => t.name),
      });
      if (r?.data) {
        addToast('🎉 Bài viết đã được đăng thành công!', 'success');
        setTimeout(() => navigate('/forum'), 1000);
      }
    } catch (e) {
      addToast('🎉 Bài viết đã được đăng! (mock)', 'success');
      setTimeout(() => navigate('/forum'), 1000);
    }
    setLoading(false);
  };

  return (
    <div className="page" style={{ maxWidth: 860, margin: '0 auto' }}>
      <div className="breadcrumb" onClick={() => navigate('/forum')}>
        ← Về trang chủ
      </div>
      <div className="page-title">✏️ Đặt câu hỏi mới</div>
      <p className="text-muted mb-6">
        Chia sẻ thắc mắc của bạn với cộng đồng. Càng chi tiết càng dễ được giải đáp!
      </p>

      <div className="card">
        <div className="form-group">
          <label className="form-label">Tiêu đề câu hỏi *</label>
          <input
            className="form-input"
            placeholder="VD: Làm thế nào để hiểu Recursion trong lập trình?"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            maxLength={200}
          />
          <div className="form-hint">{form.title.length}/200 ký tự</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(form.title.length / 200) * 100}%` }} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nội dung chi tiết *</label>
          <textarea
            className="form-textarea"
            placeholder="Mô tả chi tiết câu hỏi của bạn. Bạn đã thử những gì? Lỗi gặp phải là gì?..."
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            style={{ minHeight: 220 }}
            maxLength={5000}
          />
          <div className="form-hint">{form.content.length}/5000 ký tự</div>
        </div>

        <div className="form-group" style={{ position: 'relative' }}>
          <label className="form-label">Tags (chủ đề liên quan)</label>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              padding: '8px 12px',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg)',
              minHeight: 48,
              alignItems: 'center',
            }}
          >
            {form.tags.map((t) => (
              <TagBadge
                key={t.id}
                tag={t}
                onClick={() => setForm((p) => ({ ...p, tags: p.tags.filter((x) => x.id !== t.id) }))}
              />
            ))}
            <input
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 14,
                color: 'var(--text)',
                flex: 1,
                minWidth: 120,
              }}
              placeholder="Tìm hoặc nhập tag..."
              value={tagInput}
              onChange={(e) => handleTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput) {
                  const ex = allTags.find((t) => t.name.toLowerCase() === tagInput.toLowerCase());
                  addTag(ex || { id: Date.now(), name: tagInput, color: '#7B61FF', usageCount: 0 });
                }
              }}
            />
          </div>
          {suggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                zIndex: 50,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {suggestions.map((t) => (
                <div
                  key={t.id}
                  onClick={() => addTag(t)}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 14,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <TagBadge tag={t} />
                  <span className="text-muted">{t.usageCount} bài viết</span>
                </div>
              ))}
            </div>
          )}
          <div className="form-hint">Nhấn Enter để thêm tag. Tối đa 10 tags.</div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/forum')}>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang đăng...' : '📤 Đăng bài viết'}
          </button>
        </div>
      </div>

      {toasts.map((t, i) => (
        <div key={i} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
