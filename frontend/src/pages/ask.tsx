import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Space, Alert } from 'antd';
import TagBadge from '../components/common/TagBadge';
import { forumService } from '../services/forumService';
import { addToast } from '../utils/toast';
import { useAuth } from '../hooks/useAuth';
import type { Tag } from '../types';

const { Title, Text } = Typography;

const loadDraft = () => {
  try {
    const draft = localStorage.getItem('forum_draft');
    if (!draft) return { title: '', content: '' };
    const parsed = JSON.parse(draft);
    return { title: parsed.title || '', content: parsed.content || '' };
  } catch {
    return { title: '', content: '' };
  }
};

const AskPage: React.FC = () => {
  const { user: currentUser, loading } = useAuth();
  const draft = loadDraft();
  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      window.location.href = '/auth/login';
      return;
    }

    forumService.getTags().then(setAllTags).catch(() => {});
  }, [currentUser, loading]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      localStorage.setItem('forum_draft', JSON.stringify({ title, content }));
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [title, content]);

  const handleTagInput = (value: string) => {
    setTagInput(value);
    const query = value.trim().toLowerCase();
    if (query) {
      setSuggestions(allTags.filter((tag) => tag.name.toLowerCase().includes(query) && !selectedTags.some((item) => item.id === tag.id)));
    } else {
      setSuggestions([]);
    }
  };

  const addTag = (tag: Tag) => {
    if (selectedTags.length >= 10) {
      addToast('Tối đa 10 tags', 'warning');
      return;
    }
    if (!selectedTags.some((item) => item.id === tag.id)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setTagInput('');
    setSuggestions([]);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = 'Tiêu đề không được để trống';
    else if (title.trim().length < 5) nextErrors.title = 'Tiêu đề phải có ít nhất 5 ký tự';
    if (!content.trim()) nextErrors.content = 'Nội dung không được để trống';
    else if (content.trim().length < 10) nextErrors.content = 'Nội dung phải có ít nhất 10 ký tự';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const post = await forumService.createPost({ title: title.trim(), content: content.trim(), tags: selectedTags.map((tag) => tag.name) });
      localStorage.removeItem('forum_draft');
      addToast('🎉 Bài viết đã được đăng thành công!', 'success');
      window.location.href = `/forum/${post.id}`;
    } catch {
      addToast('Không thể đăng bài. Vui lòng thử lại!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ask-page">
      <nav className="page-nav">
        <div className="page-nav-inner">
          <div className="page-nav-title" onClick={() => { window.location.href = '/forum'; }}>
            ← Quay lại diễn đàn
          </div>
        </div>
      </nav>
      <div className="page-inner">
        <div className="ask-form-shell">
          <div className="content-card ask-card">
            <Space direction="vertical" size={24} className="full-width-space">
            <div>
              <Title level={3} className="ask-heading">✏️ Đặt câu hỏi mới</Title>
              <Text type="secondary" className="ask-subtitle">Mô tả chi tiết vấn đề, chia sẻ kết quả bạn đã thử và chọn tags phù hợp.</Text>
            </div>

            {!!errors.title && <Alert type="error" message={errors.title} showIcon className="form-alert" />}
            {!!errors.content && <Alert type="error" message={errors.content} showIcon className="form-alert" />}

            <Form layout="vertical">
              <Form.Item label="Tiêu đề câu hỏi *" validateStatus={errors.title ? 'error' : undefined} help={errors.title}>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Làm sao để debug lỗi React hook?"
                  size="large"
                  maxLength={200}
                  className="form-input"
                />
              </Form.Item>

              <Form.Item label="Nội dung chi tiết *" validateStatus={errors.content ? 'error' : undefined} help={errors.content}>
                <Input.TextArea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Mô tả rõ ràng vấn đề, mã nguồn bạn đã thử và kết quả mong muốn."
                  rows={10}
                  maxLength={5000}
                  className="form-textarea"
                />
              </Form.Item>

              <Form.Item label="Tags (chủ đề liên quan)">
                <Space wrap className="full-width-space">
                  {selectedTags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      onClick={() => setSelectedTags((prev) => prev.filter((item) => item.id !== tag.id))}
                    />
                  ))}
                </Space>
                <Input
                  value={tagInput}
                  onChange={(e) => handleTagInput(e.target.value)}
                  onPressEnter={() => {
                    if (tagInput.trim()) {
                      const existing = allTags.find((tag) => tag.name.toLowerCase() === tagInput.toLowerCase());
                      addTag(existing ?? { id: String(Date.now()), name: tagInput, color: '#7B61FF', usageCount: 0 });
                    }
                  }}
                  placeholder="Nhập để tìm hoặc thêm tag..."
                  className="form-input"
                />
                {suggestions.length > 0 && (
                  <Space direction="vertical" className="suggestion-list">
                    {suggestions.slice(0, 8).map((tag) => (
                      <Button key={tag.id} type="text" onClick={() => addTag(tag)} className="suggestion-button">
                        <TagBadge tag={tag} />
                        <Text type="secondary" className="suggestion-meta">{tag.usageCount} bài viết</Text>
                      </Button>
                    ))}
                  </Space>
                )}
                <Text type="secondary">Nhấn Enter để thêm. Tối đa 10 tags. ({selectedTags.length}/10)</Text>
              </Form.Item>

              <Form.Item>
                <Space className="form-actions">
                  <Button onClick={() => { localStorage.removeItem('forum_draft'); window.location.href = '/forum'; }}>
                    Hủy bỏ
                  </Button>
                  <Button type="primary" onClick={handleSubmit} loading={submitting}>
                    📤 Đăng bài viết
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            <Card type="inner" title="💡 Tips để nhận câu trả lời tốt hơn" className="info-card">
              <Space direction="vertical" size={8}>
                {[
                  'Mô tả vấn đề cụ thể, rõ ràng',
                  'Đính kèm đoạn code hoặc lỗi bạn gặp phải',
                  'Nêu rõ kết quả mong muốn',
                  'Chọn tags phù hợp với nội dung',
                ].map((tip) => (
                  <Text key={tip} className="text-block">&#x2714; {tip}</Text>
                ))}
              </Space>
            </Card>
          </Space>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AskPage;
