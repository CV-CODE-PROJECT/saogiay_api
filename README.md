# SaoGiay API

NestJS API cho các module:

- Login / logout bằng JWT
- Danh sách sản phẩm
- Nhập hàng
- Xuất hàng
- PostgreSQL deploy trên Neon qua Prisma
- Swagger UI tại `/docs`

## Khởi tạo

1. Tạo file `.env` từ `.env.example`
2. Cập nhật `DATABASE_URL` bằng connection string Neon
3. Chạy:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

## API chính

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `PATCH /api/products/:id`
- `POST /api/inventory/imports`
- `GET /api/inventory/imports`
- `POST /api/inventory/exports`
- `GET /api/inventory/exports`

## Swagger

Sau khi chạy app, mở:

```bash
http://localhost:3000/docs
```
