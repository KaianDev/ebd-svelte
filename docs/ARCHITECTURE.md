# Architecture — ebd-svelte

Guide to the architectural decisions of the SvelteKit frontend. This is a **living, minimal** document: it records only what has already been decided, plus what was intentionally left open. When a decision changes, update it here.

Guiding principle: **no overengineering**. We don't build layers ahead of time; we extract abstraction only when real reuse shows up.

---

## Guiding principle: proximity, not layers

SvelteKit already organizes code by **route**. So the ruler is reuse, not "layered architecture":

- Used by **a single route** → lives in the route folder (`+page.ts`, `+page.server.ts`, colocated components).
- Used by **multiple routes** → moves up to `$lib/`.
- Shared **and server-only** (secrets, tokens, DB) → `$lib/server/` (SvelteKit blocks importing these into client code).

Start colocated with the route. Promote to `$lib` **when a second place needs it** — not before.

---

## Decisions

### 1. Reads (GET) live in `load`, inline. No service layer.

The fetch goes straight into the route's `load`. There is no `service.ts`/`api.ts`/`apiGet()`. List pages **stream** the response (see decision 4) by returning the un-`await`ed promise, so the page can render a skeleton via `{#await}`:

```ts
// src/routes/app/classes/+page.server.ts
import { PUBLIC_API_URL } from '$env/static/public';
import { DEPENDS_KEYS } from '$lib/constants/depends-keys.js';
import type { ListClassesResponse } from '$lib/domain/class';
import { getPagination } from '$lib/helpers/get-pagination.js';
import { error } from '@sveltejs/kit';

export async function load({ fetch, depends, url }) {
	depends(DEPENDS_KEYS.CLASSES_LIST);
	const { page, limit } = getPagination(url);

	// No `await`: the promise is streamed to the browser as it resolves.
	const classes = fetch(`${PUBLIC_API_URL}/classes?page=${page}&limit=${limit}`).then(
		async (res): Promise<ListClassesResponse> => {
			if (!res.ok) {
				error(res.status, 'Falha ao carregar as turmas');
			}
			return res.json();
		}
	);

	return { classes };
}
```

```svelte
<!-- src/routes/app/classes/+page.svelte -->
{#await data.classes}
	<p>Carregando turmas…</p>
{:then { classes }}
	<!-- list -->
{:catch}
	<p>Erro ao carregar as turmas.</p>
{/await}
```

**Why:** zero indirection. To understand what a page loads, you just read its `load`. `${PUBLIC_API_URL}/classes` is only an imported constant, not an abstraction — hiding it behind `apiGet('/classes')` would hide the obvious and add a file hop for no gain.

**When to reconsider:** if the **same endpoint** gets called by two or more routes (e.g. list + detail reusing the same call). At that point — and only then — extract a function into `$lib/domain/<feature>/`.

### 2. Always use SvelteKit's `fetch` (injected), never the global one.

Inside `load`/hooks/`+server`, use the `fetch` from the argument (`{ fetch }`).

**Why:** it inlines the response into the HTML during SSR and reuses it during hydration, avoiding a second network request. It also inherits cookies/auth and accepts relative URLs on the server. Using the global browser `fetch` inside `load` causes a duplicate request (and a console warning).

### 3. Types live in `$lib/domain/<feature>/`.

Each feature has its own folder with the API response types, exported through a barrel.

```
src/lib/domain/
  class/
    types.ts     # Class, ListClassesResponse
    index.ts     # export * from './types'
  shared/
    pagination.ts  # Pagination (shared across all listings)
```

**Why:** types are the only genuinely shared artifact today (between `load` and components). Naming features after the backend modules (`class`, `student`, `enrollment`, `lesson`) gives us symmetry for free. Cross-cutting types (pagination) go in `shared/`, not in an `api/` folder — we have no "api" layer, so that name would be misleading.

### 4. List pages use server `load` (`+page.server.ts`) to stream.

We want progressive rendering — first paint shows a skeleton, the list fills in via `{#await}`. Real streaming only comes from a **server** `load`: a promise returned un-`await`ed is transmitted to the browser as it resolves. A promise returned from a **universal** (`+page.ts`) load is _not_ streamed — it's recreated and re-run on the client — so streaming forces `+page.server.ts`.

**The tradeoff we accepted:** server load means the request goes `browser → our SvelteKit server → ebd-api` (one extra hop), instead of the browser hitting the public API directly. We trade that hop for progressive rendering.

**When a plain (non-streaming) read is enough**, prefer a universal `load` in `+page.ts` with a normal `await` — it fetches the external, public API directly from the browser, no hop. Reach for streaming only when the call is slow enough that a skeleton improves the experience.

**Note:** streaming only works with JS enabled, and you can't `setHeaders`/`redirect` inside a streamed promise. Handle failures in the `{:catch}` block.

### 5. Revalidation via keys declared in `DEPENDS_KEYS`.

The `load` declares its dependencies with `depends(DEPENDS_KEYS.X)`, and the keys are centralized in [`src/lib/constants/depends-keys.ts`](../src/lib/constants/depends-keys.ts).

```ts
export const DEPENDS_KEYS = {
	CLASSES_LIST: 'classes:list'
} as const;
```

**Why:** it lets us revalidate data surgically with `invalidate(DEPENDS_KEYS.CLASSES_LIST)` (e.g. after creating/editing a class) without `invalidateAll()`. Centralizing the keys avoids magic strings scattered around and typos.

### 6. Configuration via public environment variable.

`PUBLIC_API_URL` in `$env/static/public` (`.env` file, with a versioned `.env.example`). The `PUBLIC_` prefix is a SvelteKit requirement for client exposure.

---

## Open (decide when the time comes)

### Writes (POST/PATCH/DELETE)

**Not decided yet — on purpose.** When the first create/edit feature shows up, choose between:

- **Form actions** (`+page.server.ts`) — progressive enhancement, works without JS, server-side validation. The SvelteKit-idiomatic path.
- **Client-side fetch** — a direct call in an event handler, followed by `invalidate(DEPENDS_KEYS.X)` to refresh the list.

We'll settle this with the real form context in hand.

---

## Quick rules (TL;DR)

- GET → inline `load`. No service.
- List pages → server `load` (`+page.server.ts`) returning an un-`await`ed promise, rendered with `{#await}`. Simple reads → universal `load` (`+page.ts`) with `await`.
- Always use the injected `fetch`.
- Types → `$lib/domain/<feature>/`. Cross-cutting → `$lib/domain/shared/`.
- Thin routes; extract to `$lib` only on real reuse.
- Universal load while the API is public; move to server when a secret appears.
- Revalidation via `depends`/`invalidate` with `DEPENDS_KEYS`.
