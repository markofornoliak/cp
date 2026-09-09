# Learn C++

Premium educational web application for learning modern C++ from foundations to advanced concepts.

**Live:** https://markofornoliak.github.io/cp/ (also accessible via /Cpp/ — GitHub Pages is case-insensitive)

## Product Vision

Learn C++ is built around one principle:

> The user should always understand where they are, what they are learning, and what they should do next.

It avoids gamification, fake dashboards, and template UI. Instead it focuses on:

- Structured learning paths
- Concise, example-driven lessons
- Real C++ execution
- Projects that produce tangible artifacts
- Progress that persists locally

### User Flow

Welcome → Home → Learning Path → Lesson → Practice → Result → Next Lesson → Progress

## Features

- **6 modules, 38 lessons** covering foundations → modern C++ (C++17/20)
- **16 exercises** with real compiler execution
- **4 guided projects**: CLI Calculator, Guessing Game, Contact Manager, Text Statistics
- **Real code execution** via Piston API (no secrets, CORS-enabled, isolated)
- **Local persistence** (localStorage, versioned, corruption-tolerant)
- **Responsive**: 320px → 1440px, bottom nav on mobile, sidebar on desktop
- **Accessible**: semantic HTML, keyboard nav, visible focus, AA contrast
- **Production-ready**: TypeScript strict, Vitest, ESLint, GitHub Pages deploy

## Architecture

```
src/
  app/          # router
  components/   # Layout, CodeBlock, MonacoEditor
  pages/        # Welcome, Home, Learn, Lesson, Practice, Projects, Progress, Settings
  content/      # modules, lessons, exercises, projects (structured data)
  services/     # execution.ts (CodeExecutionService), persistence.ts
  hooks/        # useProgress
  styles/       # global.css (design system)
  types/        # domain models
```

### Tech Stack

- React 18 + TypeScript 5.5 + Vite 5
- React Router 6 with HashRouter (static host safe)
- Monaco Editor (lazy-loaded only on practice pages)
- Lucide React (single icon library)
- Vitest + Testing Library

### Design System

- **Philosophy**: Apple-level restraint × Swiss modernism × premium technical education
- **Colors**: off-white bg (#f8f9fb), white surfaces, near-black text (#0f1720), single blue accent (#2563eb), restrained semantic colors
- **Typography**: system sans stack, monospace for code
- **Spacing**: 4/8/12/16/20/24/32/40/48/64/80
- **Radius**: 8–24px hierarchy
- **Shadows**: minimal, tonal separation over floating
- **Motion**: 150–300ms, no decoration

## C++ Execution Architecture

### Service Abstraction

`CodeExecutionService` in `src/services/execution.ts` isolates execution:

```ts
execute(code, stdin) -> ExecutionResult
submit(code, testCases) -> SubmissionResult
```

### Primary: Piston API

- Endpoint: `https://emkc.org/api/v2/piston/execute`
- Language: `c++`, Version: `10.2.0`
- No API key, public, CORS enabled
- Handles compile and runtime phases separately
- Timeout handling via AbortController
- Compiler errors extracted with line numbers

### UX

- Run: disables button, shows running state, captures stdout/stderr
- Submit: runs hidden tests, compares normalized output (trim + line-ending normalization)
- States: success, compile_error, runtime_error, timeout, service_error, accepted, wrong_answer
- Service unavailable handled gracefully with retry guidance

### Future Replacement

The service can be swapped for a WebAssembly toolchain (e.g., clang-wasm) without UI changes. Monaco is already lazy-loaded to avoid downloading compiler on welcome.

## Persistence

- Key: `learn-cpp-progress-v1`
- Versioned (current v1) for future migrations
- Stores: completed lessons/exercises/projects, current lesson, exercise results, last active
- Tolerates corrupted JSON (resets with warning)
- Reset via Settings with confirmation

## Routing & Deployment

- **HashRouter** ensures refresh works on static host (no 404)
- **Base**: `/Cpp/` configured in `vite.config.ts` — assets resolve under /Cpp/, works for both /cp/ and /Cpp/ due to GitHub Pages case-insensitivity
- **GitHub Actions**: `.github/workflows/deploy.yml` installs, typechecks, lints, tests, builds, uploads dist, deploys via `actions/deploy-pages@v4`
- Expected URL: `https://markofornoliak.github.io/cp/` (or /Cpp/)

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview prod build
npm run test       # vitest run
npm run test:watch # vitest watch
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run check      # typecheck + lint + test + build
```

## QA Performed

- Functional: welcome → home → curriculum → lesson → prev/next → exercise run/submit → error states → completion → projects → progress → reset → refresh persistence → direct navigation via hash
- Technical: `npm run check` passes (typecheck, lint 0 warnings, tests 13 passing, build succeeds)
- Responsive: manually inspected at 375, 768, 1024, 1440 — no overflow, editor usable, bottom nav on mobile, sidebar on desktop
- Visual: primary action per page, no card overload, typography hierarchy, whitespace deliberate, calm interface
- Simplification pass: removed redundant progress indicators, duplicate labels, unnecessary borders, decorative elements

## Known Limitations

- Execution depends on public Piston API availability. If down, user sees service_error with retry guidance. No local fallback compiler is bundled to keep initial load lightweight.
- Monaco Editor is ~280kb gzipped ~84kb; acceptable but could be further code-split with CDN loader for even smaller initial chunk.
- No real authentication — intentionally local-first for GitHub Pages static hosting.
- Curriculum is complete for foundations through modern C++, but advanced topics like concurrency and networking are not yet covered.

## License

MIT
