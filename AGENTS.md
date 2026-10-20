# Printar repository guide for coding agents

## Project

Printar is an in-progress product for Indian print, photocopy, document, and photo-service shops. Treat proposed MVP features and design mockups as plans until the working code proves they are available. Do not describe roadmap ideas as shipped features.

## Where things live

- `frontend/`: Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Routes are in `frontend/src/app`; shared UI is in `frontend/src/components`.
- `saasprint/`: Java 21 / Spring Boot 4 API, built with Maven. Controllers, services, and tests are under `saasprint/src`.
- `design/`: local design references; this directory is Git-ignored and may not exist in another checkout. It is not the source of truth for implemented behavior.

## Working agreements

- Read the relevant code and current Git status before editing. Preserve unrelated work and do not overwrite changes you did not make.
- For a question, explanation, or review, respond with evidence and do not edit files. For an implementation request, make the scoped change and verify it.
- When the user asks to learn or hand-code a component, explain the layout and tradeoffs; do not take over implementation unless asked.
- Keep new code near the feature it serves. Prefer the project's existing patterns over introducing new dependencies or architecture for a small change.
- Keep UI responsive and accessible: semantic elements, keyboard focus, readable contrast, and reduced-motion support where animation is used.
- Never put secrets or customer documents in source control, screenshots, logs, or examples. Check configuration examples before suggesting environment changes.
- Do not commit, push, deploy, or alter external services unless the user specifically requests it.

## Frontend-specific instructions

`frontend/AGENTS.md` adds Next.js-specific requirements. Read it before frontend changes; it requires consulting the installed Next.js docs in `frontend/node_modules/next/dist/docs/` before writing Next.js code. `frontend/CLAUDE.md` already points Claude to those instructions.

Useful checks from `frontend/`: `pnpm exec tsc --noEmit`, `pnpm test`, and `pnpm run build`. Choose the checks relevant to the change and report any that could not run.

## Backend checks

From `saasprint/`, run `./mvnw test` (or `mvnw.cmd test` on Windows) for backend changes. Verify API contract changes against the frontend callers. Do not assume an endpoint or database schema exists without checking the implementation.
