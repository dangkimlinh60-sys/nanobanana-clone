# AGENTS.md — Codex Agent Guidelines

This file tells Codex how to work in this workspace. Keep it concise and up‑to‑date. Edit the placeholders so Codex has context.

## Project Context (fill in)
- Purpose: Next.js app that clones the Nano Banana AI Image Editor landing/demo; static marketing UI with a simple editor showcase.
- Primary languages: TypeScript, JSX/TSX, CSS
- Frameworks/libs: Next.js 16, React 19, Tailwind CSS 4, Radix UI, shadcn/ui, Vercel Analytics
- Entry points: `app/page.tsx`, `app/layout.tsx`
- Build/run: `npm run build` then `npm start` (or `npm run dev` for local)
- Test: none configured
- Lint/format: Lint via `npm run lint`; no formatter configured

## Day‑to‑Day Commands (fill in)
- Run app: `npm run dev`
- Run tests: `# none`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- Generate docs: `# none`

## Editing & Style
- Keep diffs minimal; avoid drive‑by refactors; preserve existing style.
- Default to ASCII; only introduce Unicode if already used and justified.
- Add brief comments only when non‑obvious; avoid narrating simple code.
- Prefer small, focused changes with clear intent and local verification steps.

## Shell & Tools
- Always set `workdir` for shell calls; avoid `cd` unless strictly needed.
- Prefer `rg` for search and `rg --files` for listing; fall back if unavailable.
- Summarize command outputs; include only key lines relevant to the task.

## Git
- Never revert unrelated existing changes; respect a dirty worktree.
- If conflicting local changes appear unexpectedly, pause and ask how to proceed.
- Commit style: concise, imperative; consider Conventional Commits (e.g., `fix:`, `feat:`).

## Planning
- Use the plan tool for non‑trivial tasks (not for the simplest ~25%).
- Do not make single‑step plans; update the plan after each completed step.

## Approvals & Safety
- Treat potentially destructive actions as opt‑in: `rm -rf`, `git reset`, schema changes, data migrations.
- Ask before: network access, installing packages, running GUI apps, writing outside the workspace, running tests that write to global temp dirs.
- If sandbox blocks an important command, request approval with a one‑line justification.

## Reviews
- When asked to review, prioritize findings first (bugs/risks/regressions/missing tests) with `path:line` refs.
- Keep summaries brief after findings; call out open questions and assumptions.

## Output & Presentation
- Plain text; concise; friendly teammate tone.
- Use bullets; inline code for literals; fenced blocks for multi‑line code.
- File references must be standalone paths like `src/app.ts:42` or `a/server/index.js#L10` (no ranges).

## Testing & Verification
- Add or update tests when practical; note gaps when not.
- If unable to run tests, provide clear manual verify steps.

## Security & Secrets
- Do not exfiltrate or print secrets; avoid committing credentials.
- Sanitize logs/examples; prefer local mocks for external services.

## Performance & Reliability
- Favor O(n) approaches and streaming when sizes are unbounded.
- Avoid introducing global state or flakiness; make changes idempotent.

## Repository Map (fill in)
- `./app` — Next.js app router pages, layout, globals
- `./components` — UI components (shadcn/ui-style + custom)
- `./hooks` — React hooks
- `./lib` — Utilities
- `./public` — Static assets
- `./styles` — Legacy global styles (not imported by `app/layout.tsx`)
- `./next.config.mjs` — Next.js config
- `./postcss.config.mjs` — PostCSS/Tailwind config
- `./components.json` — shadcn/ui components config
- `./package.json` — Scripts and deps

## Glossary / Domain Notes (fill in)
- Nano Banana — AI image editor product/site being cloned
- shadcn/ui — Component patterns built on Radix UI and Tailwind
- Radix UI — Accessible React primitives used by components
