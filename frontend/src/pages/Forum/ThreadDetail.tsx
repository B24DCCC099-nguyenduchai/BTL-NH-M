import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Comment, Input, message, Row, Space, Typography, Tooltip } from 'antd';
import { LikeOutlined, DislikeOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import { useModel, useParams } from 'umi';
import GlassCard from '@/components/Common/GlassCard';
import TagBadge from '@/components/Common/TagBadge';
import { createComment, getComments, getPostById, voteComment, votePost } from '@/services/forumApi';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ThreadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { initialState } = useModel('@@initialState');
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ id: string; author: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    try {
      const response = await getPostById(id);
      setPost(response.data);
    } catch (error) {
      setPost(null);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setComments(response.data || []);
    } catch (error) {
      setComments([]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!initialState?.currentUser) {
      return message.warning('Vui lòng đăng nhập trước khi bình luận.');
    }

    if (!newComment.trim()) {
      return message.warning('Nội dung bình luận không được để trống.');
    }

    try {
      setSubmitting(true);
      await createComment(id, { content: newComment.trim(), parentCommentId: replyTarget?.id });
      setNewComment('');
      setReplyTarget(null);
      message.success('Bình luận đã được gửi.');
      fetchComments();
    } catch (error) {
      message.error('Không thể gửi bình luận. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoteComment = async (commentId: string, direction: 'up' | 'down') => {
    try {
      await voteComment(commentId, direction);
      fetchComments();
    } catch (error) {
      message.error('Không thể cập nhật lượt thích bình luận.');
    }
  };

  const handleVotePost = async (direction: 'up' | 'down') => {
    try {
      await votePost(id, direction);
      fetchPost();
    } catch (error) {
      message.error('Không thể cập nhật lượt thích bài viết.');
    }
  };

  const buildCommentTree = useMemo(() => {
    const map: Record<string, any> = {};
    const roots: any[] = [];

    comments.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    comments.forEach((item) => {
      if (item.parentCommentId && map[item.parentCommentId]) {
        map[item.parentCommentId].children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [comments]);

  const renderCommentTree = (comment: any) => (
    <div key={comment.id} className={`comment-item ${comment.parentCommentId ? 'comment-reply' : ''}`}>
      <Comment
        author={comment.author?.name || 'Người dùng'}
        datetime={comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
        content={<Paragraph>{comment.content}</Paragraph>}
        actions={[
          <Tooltip key="up" title="Thích">
            <span onClick={() => handleVoteComment(comment.id, 'up')}>
              <LikeOutlined /> {comment.votes || 0}
            </span>
          </Tooltip>,
          <Tooltip key="down" title="Không thích">
            <span onClick={() => handleVoteComment(comment.id, 'down')}>
              <DislikeOutlined />
            </span>
          </Tooltip>,
          <span key="reply" onClick={() => setReplyTarget({ id: comment.id, author: comment.author?.name || 'Người dùng' })}>
            <MessageOutlined /> Trả lời
          </span>,
        ]}
      />
      {comment.children?.length > 0 && (
        <div className="comment-children">
          {comment.children
            .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((child: any) => renderCommentTree(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="thread-detail-page">
      <GlassCard className="thread-header-card">
        <Title>{post?.title || '...'}</Title>
        <Space size="large" className="thread-meta">
          <Text type="secondary">Đăng bởi {post?.author?.name || 'Người dùng'}</Text>
          <Text type="secondary">{post?.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</Text>
          <Text type="secondary">{post?.views || 0} lượt xem</Text>
          <Text type="secondary">{post?.answersCount || 0} câu trả lời</Text>
        </Space>
        <div className="thread-tags">
          {post?.tags?.map((tag: any) => (
            <TagBadge key={tag.id || tag.name} label={tag.name || tag} />
          ))}
        </div>
      </GlassCard>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <GlassCard className="thread-body-card">
            <Paragraph>{post?.content || '...'}</Paragraph>
            <Space size="middle" className="thread-actions">
              <Button icon={<LikeOutlined />} onClick={() => handleVotePost('up')}>Vote up</Button>
              <Button icon={<DislikeOutlined />} onClick={() => handleVotePost('down')}>Vote down</Button>
              <Button icon={<MessageOutlined />} onClick={() => { document.getElementById('comment-editor')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Trả lời
              </Button>
            </Space>
          </GlassCard>

          <GlassCard className="answer-card">
            <Title level={4}>Các câu trả lời</Title>
            {comments.length === 0 ? (
              <Text type="secondary">Chưa có bình luận nào. Hãy là người đầu tiên tham gia.</Text>
            ) : (
              buildCommentTree.map((comment) => renderCommentTree(comment))
            )}
          </GlassCard>

          <GlassCard id="comment-editor" className="comment-editor-card">
            <Title level={4}>Viết câu trả lời</Title>
            {replyTarget && (
              <Text type="secondary">
                Trả lời <strong>{replyTarget.author}</strong>.
                <Button type="link" onClick={() => setReplyTarget(null)}>
                  Hủy
                </Button>
              </Text>
            )}
            <TextArea
              rows={5}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Nhập nội dung trả lời của bạn..."
            />
            <Space style={{ marginTop: 16 }}> 
              <Button type="primary" icon={<SendOutlined />} loading={submitting} onClick={handleAddComment}>
                Gửi bình luận
              </Button>
              <Button onClick={() => { setNewComment(''); setReplyTarget(null); }}>
                Làm mới
              </Button>
            </Space>
          </GlassCard>
        </Col>

        <Col xs={24} lg={8}>
          <GlassCard className="sidebar-card">
            <Title level={5}>Mẹo thảo luận</Title>
            <ul>
              <li>Giữ tiêu đề rõ ràng</li>
              <li>Thêm tag liên quan</li>
              <li>Phản hồi nhanh và thân thiện</li>
            </ul>
          </GlassCard>
        </Col>
      </Row>
    </div>
  );
};

export default ThreadDetail;
