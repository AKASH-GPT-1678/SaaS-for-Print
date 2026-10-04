# Frontend testing

Run commands from `frontend/`.

Use Node.js 24 for this setup, matching the project's current local runtime.

| Directory | Tools | Purpose |
| --- | --- | --- |
| `tests/vitest/unit/` | Vitest | Utilities such as class merging and the print helper |
| `tests/vitest/components/` | Vitest + React Testing Library | React UI interactions, with backend requests mocked |
| `tests/playwright/` | Playwright | Complete pages running in Chromium |

Vitest only discovers `tests/vitest/**/*.test.ts(x)`. Playwright only discovers
`tests/playwright/**/*.spec.ts`. Their setup and test files stay separate.

## Commands

```bash
pnpm test                 # All 10 Vitest unit/component tests, once
pnpm test:watch           # Vitest watch mode
pnpm test:unit            # Utility tests only
pnpm test:components      # React component tests only
pnpm test:e2e             # The single Playwright browser test
pnpm test:e2e:ui          # Playwright's interactive test runner
pnpm test:e2e:report      # Open the latest HTML report
pnpm test:all             # Vitest, then Playwright
```

## First-time browser setup

After installing dependencies, download Chromium once:

```bash
pnpm exec playwright install chromium
```

Playwright starts and stops a Next.js dev server on `http://127.0.0.1:3100`.
Its generated files go in `dist/e2e`, controlled by `PRINTAR_E2E=1`.
This allows your normal dev server to keep running. The current smoke test
selects and removes a file without submitting it, so Java, AWS, and real user
accounts are not required. It does not test backend delivery or physical printing.

To test an already-running frontend instead, set `PLAYWRIGHT_BASE_URL` before
running Playwright. For example, in PowerShell:

```powershell
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm test:e2e
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

## Adding tests

Add pure logic tests to `vitest/unit/`, React interaction tests to
`vitest/components/`, and browser journeys to `playwright/`.
Import `describe`, `it`, `expect`, and `vi` from `vitest` in fast tests.
Import `test` and `expect` from `@playwright/test` in browser tests.
The shared Vitest setup loads jest-dom matchers and cleans up mounted components.
The print tests simulate the browser print request; they cannot verify printer
hardware or browser PDF plug-in behavior.

Async Server Components should be covered through Playwright. Vitest here covers
client components and utilities.

References: [Next.js Vitest guide](https://nextjs.org/docs/app/guides/testing/vitest),
[Next.js Playwright guide](https://nextjs.org/docs/app/guides/testing/playwright).
