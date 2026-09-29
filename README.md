# SEC101 — Everyday Security

Interactive security fundamentals course for non-technical users. Covers passwords, MFA, phishing, safe browsing, messaging privacy, and device security.

## Features

- Step-by-step tutorials with quizzes
- Progress tracking (saved locally)
- English and Ukrainian: Ukrainian when the device lists Ukrainian among its languages or uses Kyiv time, English otherwise; the language toggle choice is remembered

## Run Locally

```bash
bun install
bun run dev
```

## Verify

```bash
bun run lint
bun run test
bun run build
```

## Deploy

```bash
bun run build
bun run start
```

Build outputs static files to `dist/`; `bun run start` serves them with cache headers and brotli/gzip compression.

## License

MIT
