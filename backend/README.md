# Backend Diễn đàn hỏi đáp

Backend sử dụng Node.js + Express + Sequelize + MySQL.

## Khởi động

1. Cài dependencies:

```bash
cd backend
npm install
```

2. Tạo file `.env` từ `.env.example` và cấu hình MySQL.

3. Chạy server:

```bash
npm run dev
```

## Cấu trúc

- `src/app.js` - cấu hình Express app
- `src/server.js` - khởi động server
- `src/routes/` - routes chính
- `src/controllers/` - controllers xử lý yêu cầu
- `src/services/` - logic nghiệp vụ
- `src/models/` - định nghĩa model Sequelize
- `src/middlewares/` - middleware auth và error
- `src/config/` - cấu hình DB, JWT, role
