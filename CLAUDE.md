# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **This is NOT the Next.js you know.** Next.js 16 has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Commands

```bash
npm run dev        # dev server on :3000
npm run build      # production build
npm run lint       # ESLint
```

No test suite in this project currently.

## Architecture

### App Router layout

```
src/
├── app/
│   ├── actions/         # Server Actions — all gateway calls live here
│   ├── api/auth/[...nextauth]/  # NextAuth credentials handler
│   ├── dashboard/       # Protected routes (middleware enforces auth)
│   ├── login/ signup/ reset/   # Public auth pages
│   └── styles/          # Design token CSS + themes
├── components/
│   ├── ui/              # Reusable primitives (Button, Input, …)
│   └── */               # Feature components (Account, Sidebar, Template, WhatsAppSender)
├── config/envs.ts       # Zod-validated env vars (NEXT_PUBLIC_BACKEND_URL)
├── enum/                # Roles (OWNER > SUPERVISOR > EMPLOYEE), PasswordType
├── hooks/               # useAuth, useActiveSession, useUserForm
├── interfaces/          # TypeScript types for User, Session, Template, Employees
└── lib/index.ts         # api() fetch helper
```

### Authentication flow

`next-auth` uses a Credentials provider with JWT strategy (7-day sessions).

Login sequence:
1. POST `/auth/login` → backend sets `access_token` cookie and returns it in `Set-Cookie`
2. NextAuth extracts the token from response headers
3. GET `/auth/me` with `Bearer <token>` → hydrates user object into JWT
4. The JWT payload carries `id`, `name`, `lastName`, `phone`, `email`, `role`, `company`, `companyLogo`, `ownerId`, `accessToken`

Server Actions retrieve the token with:
```ts
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';
const token = await getToken({ req: { headers: { cookie: ... } } });
```

`middleware.ts` guards all `/dashboard/*` routes — unauthenticated requests are redirected to `/login`.

### Server Actions pattern

All gateway calls are plain `async` functions in `src/app/actions/`. They run on the server, so they can safely read the NextAuth JWT from cookies.

Typical shape:
```ts
export async function doSomething(payload) {
  const token = await getAccessToken();   // extracts from NextAuth cookie
  const res = await fetch(`${API_URL}/endpoint`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}
```

For simple GET/POST calls there is a generic helper: `api(endpoint, method, data?, token?)` in `src/lib/index.ts`.

### Styling system

Tokens → Themes → Components. Do not hardcode colors or spacing.

| Layer | Location | Purpose |
|---|---|---|
| Tokens | `src/app/styles/tokens/` | CSS custom properties: colors, spacing (8px scale), typography, borders, shadows, animations |
| Themes | `src/app/styles/themes/light.css` / `dark.css` | Maps tokens to semantic vars (`--color-brand-*`, `--color-text-*`, `--color-surface-*`, etc.) |
| Globals | `src/app/styles/globals.css` | Imports tokens → themes → base reset → utilities |

Dark theme activates via `[data-theme="dark"]` on the root element.

**Component styling:** CSS Modules co-located with each component (`Component.module.css`). Use BEM-ish class names. Reference design tokens via `var(--token-name)` — never hardcode values.

```ts
import styles from './Button.module.css';
<button className={`${styles.button} ${styles[variant]}`} />
```

### UI component conventions

- **Button**: variants `primary | secondary | outline | ghost | danger`, sizes `sm | md | lg`, supports `loading`, `leadingIcon`, `trailingIcon`, `iconOnly`
- **Input**: props `label`, `helperText`, `errorMessage`, `leadingIcon`, `trailingIcon` — always wire `aria-invalid` and `aria-describedby`
- Icons come from `lucide-react`
- Validation schemas use `zod`

### Role hierarchy

`OWNER → SUPERVISOR → EMPLOYEE`. The backend enforces roles via `RolesGuard`; the frontend uses the `role` field from the session to conditionally render UI (e.g., the "Employees" nav item is hidden for `EMPLOYEE` role).

## Environment

`src/config/envs.ts` validates `NEXT_PUBLIC_BACKEND_URL` with Zod at startup — missing or malformed values throw at build time.

Required `.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:<gateway_port>
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=http://localhost:3000
```
