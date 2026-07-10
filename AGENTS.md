<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# admin-app — quy tắc riêng cho FE (PropertyOS)

## Skill/rule chính thức dùng ở đây: Vercel Plugin

Cài 1 lần (dùng được cho cả Claude Code và Cursor):

```bash
cd apps/admin-app
pnpm dlx plugins add vercel/vercel-plugin
```

Skill hữu ích nhất cho project này: `nextjs`, `react-best-practices`, `next-cache-components`, `turbopack`, `vercel-cli`, `deployments-cicd`. Gọi trực tiếp khi cần, ví dụ:

```
/vercel-plugin:nextjs
/vercel-plugin:deploy prod
```

Không cần tự viết rule Next.js/React từ đầu — ưu tiên dùng skill có sẵn của plugin, chỉ bổ sung quy tắc đặc thù dự án bên dưới.

## Quy tắc đặc thù PropertyOS

1. **Auth & DB đi qua Supabase** (`@supabase/supabase-js` + `@supabase/ssr`) — không tự viết JWT/session, không gọi Postgres qua driver khác.
2. Dùng `src/lib/supabase/server.ts` trong Server Component/Route Handler, `src/lib/supabase/client.ts` trong Client Component — không dùng nhầm client cho server.
3. Thao tác CRUD đơn giản (building, room, contract) → gọi thẳng Supabase từ Route Handler/Server Action. Thao tác tính toán/sinh hóa đơn → gọi sang `billing-service` qua `src/lib/billing-client.ts`, không tự implement logic tài chính ở FE.
4. Bật Row Level Security (RLS) cho mọi bảng Supabase mới tạo — xem quy tắc phân quyền ở `docs/DATABASE.md`.
5. UI dùng HeroUI Pro block có sẵn trước khi tự viết component mới; giữ Tailwind + Framer Motion nhất quán với phần còn lại của app. Import component HeroUI từ package lẻ (VD `@heroui/button`), không import từ `@heroui/react` (chỉ dùng `@heroui/react` để lấy `heroui`/`HeroUIProvider`).
6. Next.js 16: Turbopack là bundler mặc định, dùng `use cache`/Cache Components khi cần cache dữ liệu (xem skill `next-cache-components`), không dùng pattern Pages Router.

## HeroUI v2 (đã cài, không phải v3)

`@heroui/react` mới publish v3 (viết lại toàn bộ, không tương thích ngược, không còn `HeroUIProvider`) — project này **cố tình pin ở v2** (`^2.8.10`) vì license HeroUI Pro đang có là cho v2. Đừng tự ý bump `@heroui/react` lên `^3` dù thấy version mới hơn.

- Cấu hình Tailwind v4: `hero.ts` (root `apps/admin-app`) export plugin `heroui()`, nạp vào `globals.css` qua `@plugin '../../hero.ts'` + `@source` trỏ vào `@heroui/theme/dist` + `@custom-variant dark`.
- `HeroUIProvider` bọc ở `src/app/providers.tsx`, gắn vào `src/app/layout.tsx`.
- pnpm cần `.npmrc` với `public-hoist-pattern[]=*@heroui/*` (đã có) — nếu thiếu, các package `@heroui/*` lẻ sẽ không resolve đúng.
- Import component từ package lẻ (`@heroui/button`, `@heroui/card`...), không import từ `@heroui/react` (chỉ dùng để lấy `heroui`/`HeroUIProvider`).
- **HeroUI Pro không phải package npm** — đây là block/template lấy qua CLI hoặc dashboard heroui.pro bằng license/token cá nhân của bạn. Muốn thêm block Pro: đăng nhập heroui.pro → copy block (hoặc dùng HeroUI Pro CLI/MCP với Personal Token của bạn) → dán vào `src/components/`. Việc này cần credential cá nhân nên bạn tự thực hiện, agent không tự đăng nhập/tải hộ.
