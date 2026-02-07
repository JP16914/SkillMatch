# SkillMatch - Job Tracker & Matching Engine

SkillMatch là một nền tảng quản lý quy trình tìm việc hiện đại, tích hợp công cụ Matching Score thông minh dựa trên AI/NLP để tối ưu hóa hồ sơ ứng viên với mô tả công việc.

## 🚀 Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, TanStack Query, Lucide React.
- **Backend (Core):** NestJS, Prisma ORM, PostgreSQL, Redis (BullMQ), WebSockets, Swagger.
- **Matching Service:** FastAPI (Python), SQLAlchemy, Celery, Spacy/NLP.
- **Infra:** Docker Compose, MinIO (S3-compatible), GitHub Actions.
- **Monorepo:** pnpm workspaces.

## 🛠 Setup & Installation

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- Python >= 3.9
- Docker & Docker Compose

### Quick Start
1. **Clone repo:**
   ```bash
   git clone <repo-url>
   cd SkillMatch
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start Infrastructure:**
   ```bash
   make infra-up
   ```

4. **Environment Variables:**
   Sao chép `.env.example` thành `.env` trong các thư mục `apps/api`, `apps/web`, và `services/matching`.

5. **Run Development:**
   ```bash
   pnpm dev
   ```

## 📂 Architecture
- `apps/web`: Giao diện người dùng.
- `apps/api`: Gateway xử lý Auth, CRUD, Flow chính.
- `services/matching`: Engine tính toán điểm khớp lệnh (Match Score).
- `packages/shared`: Shared types & schemas.

## 📖 API Documentation
- NestJS: `http://localhost:4000/docs`
- FastAPI: `http://localhost:8000/docs`

## 📄 License
MIT
