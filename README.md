# admin-app

FE + BE nhẹ của PropertyOS — Next.js App Router, xử lý auth (Supabase) và CRUD tòa nhà/phòng/hợp đồng trực tiếp qua Supabase, không cần backend riêng cho các thao tác này.

- **Stack**: Next.js (App Router) + React + Tailwind CSS v4 + Framer Motion + HeroUI v2 + HeroUI Pro
- **Auth & DB**: Supabase (Postgres + Auth)
- **Gọi sang**: `apps/billing-service` (Spring Boot) khi cần sinh hóa đơn/tính toán tài chính — xem `src/lib/billing-client.ts`

## Chạy dev

```bash
pnpm install
cp .env.example .env.local   # điền NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
pnpm dev
```

## Deploy

Deploy trực tiếp lên [Vercel](https://vercel.com) (free Hobby tier) từ repo `propertyos-admin-app` — Root Directory để mặc định (`./`), không cần đổi, vì repo này (sau khi tách khỏi monorepo) đã có `package.json` ngay ở gốc. Set các biến môi trường ở bước "Environment Variables" của Vercel giống `.env.example`.

## Cấu trúc

```
hero.ts                     # HeroUI v2 Tailwind plugin (heroui())
.npmrc                       # pnpm hoist cho @heroui/*
src/
├── app/
│   ├── page.tsx           # trang chủ
│   ├── layout.tsx
│   ├── providers.tsx       # HeroUIProvider
│   └── api/health/         # health check
└── lib/
    ├── supabase/
    │   ├── client.ts        # Supabase client (Client Component)
    │   └── server.ts        # Supabase client (Server Component/Route Handler)
    └── billing-client.ts     # gọi sang billing-service
```

## HeroUI v2 + HeroUI Pro

`@heroui/react` đã pin ở v2 (`^2.8.10`) — HeroUI vừa ra v3 nhưng viết lại hoàn toàn, không tương thích license Pro hiện có. Sau `pnpm install`, HeroUI v2 (provider, plugin Tailwind) đã sẵn sàng dùng.

HeroUI Pro **không phải package cài qua npm** — đây là block/template lấy bằng license cá nhân của bạn tại [heroui.pro](https://heroui.pro) (CLI, MCP hoặc copy tay từ dashboard). Bạn cần tự đăng nhập bằng tài khoản đã mua license để lấy block, dán vào `src/components/`.

Xem roadmap chi tiết ở `../../docs/ROADMAP.md` (Giai đoạn 1-3, 5 là phần của `admin-app`).
