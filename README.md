# ShiftStore Production Launch Guide (Durga Puja 48-Hour Playbook)

This guide provides the exact commands, configuration, and architectural walkthrough to launch ShiftStore to production in under 5 minutes.

---

## 1. Local Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm or bun

### Step-by-Step CLI Execution
```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Initialize SQLite Database & Prisma Client
npx prisma generate
npx prisma db push

# 4. Seed Database with Hero Drop, Bundles & Admin User
npx tsx prisma/seed.ts

# 5. Start Development Server (Full-Stack Express + Vite)
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 2. Environment Variables (.env)

```env
# Database: SQLite local path (or Turso libSQL url for serverless edge)
DATABASE_URL="file:./prisma/dev.db"

# Admin Authentication
ADMIN_EMAIL="admin@shiftstore.in"
ADMIN_PASSWORD_HASH="$2a$10$wB9Vp9J9V1lS8ZtY4O1s7.ZzY1jT4X6W9K8L7M6N5O4P3Q2R1S0T"
ADMIN_DEFAULT_PASSWORD="PujaSale2026!"
SESSION_SECRET="shiftstore_festive_secret_key_9876543210_durga_puja"

# Razorpay Payment Gateway (Test or Production live keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_ShiftStorePuja2026"
RAZORPAY_KEY_SECRET="rzp_sec_mock_festive_secret_key"

# Store & WhatsApp Configuration
NEXT_PUBLIC_STORE_NAME="ShiftStore India"
NEXT_PUBLIC_SUPPORT_PHONE="+91 98765 43210"
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
NEXT_PUBLIC_CURRENCY_SYMBOL="₹"

PORT=3000
```

---

## 3. Five-Minute Production Deployment

### Option A: Self-Contained VPS (Hetzner, DigitalOcean, AWS EC2)
Ideal for SQLite because disk latency is $\approx 0\text{ms}$ with zero external database connection overhead.

```bash
# 1. Clone repository on the VPS
git clone https://github.com/your-brand/shiftstore.git /var/www/shiftstore
cd /var/www/shiftstore

# 2. Install production dependencies and build
npm ci
npm run build

# 3. Setup persistent database
npx prisma db push
npx tsx prisma/seed.ts

# 4. Run with PM2 Process Manager
npm install -g pm2
pm2 start server.ts --name "shiftstore" --interpreter tsx
pm2 save
pm2 startup

# 5. Setup Nginx Reverse Proxy with SSL (Certbot)
# Proxy pass port 3000 to your domain (e.g., shiftstore.in)
```

### Option B: Vercel Deployment (Next.js App Router + Turso / libSQL)
If deploying directly as a Next.js 14 App Router project on Vercel:
1. Push code to GitHub.
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to Turso/libSQL or PostgreSQL (`provider = "postgresql"`).
3. Connect repo to Vercel and define environment variables from `.env.example`.
4. Deploy! All Server Actions (`actions/order.ts`, `actions/pincode.ts`) and Route Handlers (`app/api/razorpay/verify/route.ts`) are 100% native Next.js 14 App Router primitives.

---

## 4. Admin Access & Credentials
- **URL**: `/admin` (or `/admin/login`)
- **Default Email**: `admin@shiftstore.in`
- **Default Password**: `PujaSale2026!`
- **Capabilities**:
  - Live KPI Revenue, Orders, Pending COD counts, and CRO rate.
  - 1-Click WhatsApp Customer Confirmation (`wa.me/{phone}?text=...`).
  - Inline order status progression (`NEW` $\to$ `CONFIRMED` $\to$ `SHIPPED` $\to$ `DELIVERED`).
  - Promote catalog products to Hero Drop of the day and adjust prices on the fly.
