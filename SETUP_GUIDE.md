# 🚀 FRONTEND SETUP GUIDE - HOÀN CHỈNH

## ✅ STATUS: TẤT CẢ FILES ĐẦY ĐỦ - SẴN DÙNG NGAY

---

## 📥 BƯỚC 1: COPY FOLDER

```bash
# Copy toàn bộ frontend-complete/ vào project
cp -r frontend-complete/ /path/to/your/project/frontend

cd /path/to/your/project/frontend
```

---

## 🔧 BƯỚC 2: CÀI ĐẶT DEPENDENCIES

```bash
npm install

# Nếu có lỗi peer deps:
npm install --legacy-peer-deps
```

---

## ⚙️ BƯỚC 3: CẤU HÌNH ENVIRONMENT

File `.env` đã có sẵn:
```
API_URL=http://localhost:5000/api/v1
```

Nếu backend chạy ở port khác, chỉnh sửa `.env`:
```bash
nano .env
# hoặc dùng editor yêu thích
```

---

## 🚀 BƯỚC 4: CHẠY DEVELOPMENT SERVER

```bash
npm run dev

# Nếu port 8000 bận:
npm run dev -- --port 3000
```

Output sẽ hiện:
```
ready on http://localhost:8000
```

---

## 🌐 BƯỚC 5: TRUY CẬP

Mở browser:
```
http://localhost:8000
```

---

## 🔐 BƯỚC 6: LOGIN TEST

Dùng demo account:
```
Email: admin@forum.edu.vn
Password: 123456
```

Hoặc:
```
Email: sv_tranminh@student.edu.vn
Password: 123456
```

---

## 📋 FOLDER STRUCTURE

```
frontend-complete/
├── src/
│   ├── pages/              ✅ 8 pages
│   ├── components/         ✅ 13 components
│   ├── services/           ✅ 9 services
│   ├── hooks/              ✅ 3 hooks
│   ├── utils/              ✅ 2 utilities
│   ├── styles/             ✅ 1 global style
│   ├── layouts/            ✅ 3 layouts
│   ├── types.ts            ✅ Types
│   └── app.tsx             ✅ App wrapper
├── public/
│   └── index.html          ✅ HTML
├── .umirc.ts               ✅ Routes config
├── tsconfig.json           ✅ TS config
├── package.json            ✅ Dependencies
├── .env                    ✅ Environment
├── .env.example            ✅ Env template
├── .gitignore              ✅ Git rules
└── README.md               ✅ Docs
```

**TỔNG: 45+ FILES ✅**

---

## ✨ CÓ GÌ

### Pages (8)
- Home page
- Forum list
- Post detail
- Ask question
- User profile
- Login
- Register
- Admin dashboard

### Components (13)
- Navbar
- Post card
- Vote buttons
- Comments
- User avatar
- Role badge
- Tag badge
- Loading spinner
- Skeleton loader
- Empty state
- Toast notifications
- Layouts (3)

### Services (9)
- API config
- Auth service
- Forum service
- User service
- Admin service
- (+ alternate versions)

### Hooks (3)
- useAuth
- useDarkMode
- useDebounce

### Features
✅ Search & filter
✅ Sort & pagination
✅ Nested comments
✅ Vote system
✅ Dark mode
✅ Responsive design
✅ Error handling
✅ Loading states
✅ Toast notifications

---

## 🔗 API ENDPOINTS

Kết nối với backend tại:
```
http://localhost:5000/api/v1
```

Endpoints:
- Auth: login, register, change password
- Forum: posts, comments, votes, tags
- User: profile, avatar, settings
- Admin: users, posts, tags, statistics

---

## 🎯 COMMANDS

```bash
npm run dev                      # Dev server (port 8000)
npm run dev -- --port 3000     # Custom port
npm run build                    # Production build
npm install --legacy-peer-deps   # If peer error
rm -rf .umi && npm run dev      # Clear cache
```

---

## 🐛 TROUBLESHOOTING

### npm install fails
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Port 8000 in use
```bash
npm run dev -- --port 3000
```

### API errors
1. Check backend running: `http://localhost:5000`
2. Check .env: `API_URL=http://localhost:5000/api/v1`
3. Check F12 Network tab

### Styles not loading
```bash
rm -rf .umi
npm run dev
```

---

## ✅ REQUIREMENTS

```
Node.js: >= 16.0.0
npm: >= 8.0.0
Backend: http://localhost:5000/api/v1
```

---

## 🎉 READY!

✅ All files included
✅ No modifications needed
✅ Just copy & run
✅ Production quality

---

**Version: 1.0.0 | Status: Complete**
