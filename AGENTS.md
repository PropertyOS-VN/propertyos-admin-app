<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# admin-app — quy tắc riêng cho FE (PropertyOS)

## Skill/rule chính thức dùng ở đây: Vercel Plugin

Cài 1 lần (dùng được cho cả Claude Code và Cursor):

```bash
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

## Code style — component & comment

- **Luôn viết component dạng function component** (`function` hoặc arrow function), không dùng class component.
- **Mỗi function (component, hook, helper) có JSDoc tóm tắt tính năng** ngay phía trên, kể cả function nhỏ — nêu component/hàm này làm gì, không cần liệt kê hết từng prop nếu đã rõ qua TypeScript type.
- Comment giải thích thêm cho đoạn code khó hiểu/có logic đặc biệt (VD: tính toán, điều kiện phức tạp, workaround) — không comment những dòng code đã tự giải thích rõ ràng.
- **Comment 1 dòng dùng `//`**, **comment nhiều dòng dùng `/* ... */`** — không dùng nhiều dòng `//` liên tiếp để thay cho comment khối.
- **Comment/JSDoc tiếng Việt phải gõ có dấu đầy đủ** (VD: "Kiểm tra hợp đồng còn hiệu lực" — không viết "Kiem tra hop dong con hieu luc"). Không dùng tiếng Việt không dấu trong code.

```tsx
/**
 * Hiển thị danh sách phòng của 1 tòa nhà, cho phép đổi trạng thái (trống/đang thuê).
 */
function RoomList({ buildingId }: { buildingId: string }) {
  // Trạng thái phòng đang chọn để hiện modal đổi trạng thái
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  /*
   * Phòng đang có hợp đồng active thì không cho đổi sang "trống" trực tiếp —
   * phải kết thúc hợp đồng trước. Check này lặp lại ở nhiều nơi nên tách
   * thành hàm riêng bên dưới thay vì viết trùng logic.
   */
  const canMarkAsEmpty = (room: Room) => !room.activeContractId;

  return <div>{/* ... */}</div>;
}
```

## Tooling — lint/format/commit

- **ESLint** (`eslint.config.mjs`, flat config, dựa trên `eslint-config-next/core-web-vitals` + `eslint-config-prettier`): `pnpm lint` / `pnpm lint:fix`.
- **Prettier** (`.prettierrc.json`): `pnpm format` / `pnpm format:check`. ESLint không lo việc format (đã tắt rule trùng qua `eslint-config-prettier`) — Prettier lo toàn bộ style.
- **Husky + lint-staged**: `pre-commit` tự chạy ESLint fix + Prettier trên file staged; `commit-msg` chặn commit không đúng chuẩn Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`...). Cần chạy `pnpm install` 1 lần (script `prepare`) để kích hoạt hook — nếu hook không chạy, kiểm tra `git config core.hooksPath` đã trỏ về `.husky` chưa.
- **TypeScript**: `pnpm typecheck` (tách riêng khỏi `next build` để chạy nhanh hơn trong CI).
- **CI** (`.github/workflows/ci.yml`): mọi PR chạy `format:check` → `lint` → `typecheck` → `test` (unit) → `build`, rồi job riêng chạy `test:e2e` (Playwright). Code không qua CI thì không merge.

## Testing

- **Unit test — Vitest** (`vitest.config.mts`): `pnpm test` (chạy 1 lần) / `pnpm test:watch` / `pnpm test:coverage`. Dùng cho Client Component, custom hook, helper/util thuần túy — file test đặt cạnh file được test, đuôi `.test.ts`/`.test.tsx` (xem mẫu `src/app/api/health/route.test.ts`).
- **Không unit test Server Component/Route Handler phức tạp** (có gọi Supabase/`billing-service`) — runtime Next.js khó mock đúng trong Vitest. Loại này test qua Playwright (E2E) hoặc tách phần logic thuần túy ra hàm riêng để unit test, phần gọi I/O thì để E2E cover.
- **E2E — Playwright** (`playwright.config.ts`, thư mục `e2e/`): `pnpm test:e2e`. Tự động `build` + `start` app trước khi chạy, không cần server chạy sẵn. Ưu tiên viết E2E cho luồng quan trọng (đăng nhập, tạo hợp đồng, tạo hóa đơn) — xem mẫu `e2e/health.spec.ts`.
- Khi thêm tính năng mới có UI tương tác hoặc luồng nghiệp vụ, viết kèm ít nhất 1 test (unit hoặc E2E tùy loại) — đừng chỉ dựa vào kiểm tra thủ công.

## HeroUI v2 (đã cài, không phải v3)

`@heroui/react` mới publish v3 (viết lại toàn bộ, không tương thích ngược, không còn `HeroUIProvider`) — project này **cố tình pin ở v2** (`^2.8.10`) vì license HeroUI Pro đang có là cho v2. Đừng tự ý bump `@heroui/react` lên `^3` dù thấy version mới hơn.

- Cấu hình Tailwind v4: `hero.ts` (root repo này) export plugin `heroui()`, nạp vào `globals.css` qua `@plugin '../../hero.ts'` + `@source` trỏ vào `@heroui/theme/dist` + `@custom-variant dark`.
- `HeroUIProvider` bọc ở `src/app/providers.tsx`, gắn vào `src/app/layout.tsx`.
- pnpm cần `.npmrc` với `public-hoist-pattern[]=*@heroui/*` (đã có) — nếu thiếu, các package `@heroui/*` lẻ sẽ không resolve đúng.
- Import component từ package lẻ (`@heroui/button`, `@heroui/card`...), không import từ `@heroui/react` (chỉ dùng để lấy `heroui`/`HeroUIProvider`).
- **HeroUI Pro không phải package npm** — đây là block/template lấy qua CLI hoặc dashboard heroui.pro bằng license/token cá nhân của bạn. Muốn thêm block Pro: đăng nhập heroui.pro → copy block (hoặc dùng HeroUI Pro CLI/MCP với Personal Token của bạn) → dán vào `src/components/`. Việc này cần credential cá nhân nên bạn tự thực hiện, agent không tự đăng nhập/tải hộ.
