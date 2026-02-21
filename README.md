# saogiay_api
src/
├── configs/         # Cấu hình Database, Environment variables
├── controllers/     # Xử lý Request và trả về Response (không viết logic ở đây)
├── services/        # Nơi chứa Logic nghiệp vụ (Business Logic) chính
├── models/          # Định nghĩa Schema (Mongoose, Sequelize, Prisma)
├── middlewares/     # Auth, Error Handling, Logging
├── routes/          # Khai báo các endpoint
├── utils/           # Helper functions (JWT, hashing password)
├── validatons/      # Validate dữ liệu đầu vào (Joi hoặc Zod)
└── app.js           # File khởi tạo server