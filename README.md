# 📚 Diễn đàn Hỏi Đáp Sinh viên

Frontend application cho diễn đàn Q&A dành cho sinh viên, xây dựng với UmiJS + React + TypeScript.

## 🚀 Bắt đầu nhanh

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

Truy cập http://localhost:8000

### Build production
```bash
npm run build
```

## 📁 Cấu trúc dự án

```
src/
├── pages/              # Các trang chính
│   ├── index.tsx      # Trang chủ
│   ├── forum/         # Danh sách & chi tiết bài viết
│   ├── ask.tsx        # Đặt câu hỏi
│   ├── profile.tsx    # Hồ sơ người dùng
│   ├── auth/          # Login/Register
│   └── admin/         # Admin dashboard
├── components/        # React components
│   ├── common/        # Components dùng chung
│   ├── forum/         # Forum-specific components
│   └── layout/        # Layout components
├── services/          # API services
├── hooks/             # Custom hooks
├── utils/             # Utility functions
├── types.ts           # TypeScript interfaces
├── app.tsx            # App wrapper
└── styles/            # Global styles
```

## 🔌 API Configuration

Cấu hình API endpoint trong `.env`:
```
API_URL=http://localhost:5000/api/v1
```

## 🔐 Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@forum.edu.vn | 123456 | Admin |
| sv_tranminh@student.edu.vn | 123456 | Student |
| gv_nguyenha@lecturer.edu.vn | 123456 | Lecturer |

## 📱 Features

- ✅ Danh sách bài viết với filter, search, sort
- ✅ Chi tiết bài viết + comments lồng nhau
- ✅ Đặt câu hỏi mới với tags
- ✅ Vote bài viết & bình luận
- ✅ Hồ sơ người dùng
- ✅ Admin dashboard (thống kê, quản lý users/posts/tags)
- ✅ Dark mode
- ✅ Responsive design
- ✅ Toast notifications

## 🛠️ Tech Stack

- **Framework**: UmiJS 4
- **Language**: TypeScript
- **Styling**: Less + CSS variables
- **HTTP Client**: Axios
- **UI Components**: Ant Design

## 📖 Development

### Thêm page mới
Tạo file trong `src/pages/`, UmiJS tự động routing.

### Thêm component mới
```bash
# Create in src/components/[category]/ComponentName.tsx
```

### Gọi API
```typescript
import { forumService } from '@/services/forumService';

const posts = await forumService.getPosts({ page: 1, sort: 'newest' });
```

## 🚀 Deployment

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Environment variables
```
# .env.production
API_URL=https://your-api.herokuapp.com/api/v1
```

## 📝 License

MIT
