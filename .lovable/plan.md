## AI Workplace Productivity Assistant

A modern SaaS-style app with a collapsible sidebar, dashboard, and five AI-powered tools. No login; outputs live in the current session (and `localStorage` for counters/recents so the dashboard isn't empty on refresh). Powered by Lovable AI Gateway (`google/gemini-3-flash-preview`) — no API keys needed from you.

### Design

- Modern SaaS look using the spec palette (`#4F46E5` primary, `#7C3AED` accent, slate neutrals), Inter font.
- Tokens defined in `src/styles.css` (`@theme` + shadcn `oklch` variables). No hardcoded colors in components.
- shadcn Sidebar (`collapsible="icon"`) + topbar with `SidebarTrigger`. Responsive: drawer on mobile, icon-rail on tablet, full sidebar on desktop.

### Routes (TanStack Start, file-based)

```
src/routes/
  __root.tsx              SidebarProvider + AppSidebar + Outlet, head metadata
  index.tsx               Dashboard (metric cards, recent activity, quick-launch)
  email.tsx               Smart Email Generator
  notes.tsx               Meeting Notes Summarizer
  tasks.tsx               AI Task Planner
  research.tsx            AI Research Assistant
  chat.tsx                AI Chatbot
  settings.tsx            Preferences (default tone, clear local data, disclaimer)
  api/
    ai.ts                 POST: one-shot generation (email/notes/tasks/research) -> structured text
    chat.ts               POST: streaming chat via AI SDK useChat transport
```

Each route sets unique `head()` title/description/og tags. Every route with logic has `errorComponent` + `notFoundComponent`; root has `notFoundComponent` and router has `defaultErrorComponent`.

### Shared components

```
src/components/
  app-sidebar.tsx         Nav: Dashboard, Email, Notes, Tasks, Research, Chat, Settings
  topbar.tsx              SidebarTrigger + app title
  metric-card.tsx         Icon + label + count
  tool-shell.tsx          Page header (title, subtitle, icon) + two-pane layout
  output-editor.tsx       Editable textarea + Copy / Download (.txt or .md) / Regenerate / Edit toggle
  ai-loading.tsx          Skeleton/streaming indicator
  responsible-ai-notice.tsx  Small disclaimer banner (shown in footer of each tool + Settings)
  markdown.tsx            react-markdown wrapper for chat/research output
```

### AI integration

- `src/lib/ai-gateway.server.ts` — Lovable AI Gateway provider helper (per the gateway knowledge file).
- `src/routes/api/ai.ts` — server route. Accepts `{ tool: "email"|"notes"|"tasks"|"research", input: {...} }`, builds the structured prompt from the spec, calls `generateText` with `google/gemini-3-flash-preview`, returns `{ text }`. Surfaces 429 (rate limit) and 402 (credits) with clear messages.
- `src/routes/api/chat.ts` — streaming `useChat` endpoint with workplace-assistant system prompt.
- Client calls `/api/ai` via `fetch` from each tool page; chat page uses `@ai-sdk/react` `useChat` + `DefaultChatTransport({ api: "/api/chat" })`. Render `message.parts` with markdown.

### Tool pages (shared pattern)

Left pane: structured form (inputs per spec).
Right pane: `OutputEditor` — streaming/loading state → editable result with Edit / Copy / Download / Regenerate.

- **Email**: textarea (context), recipient, purpose, tone select (Formal/Friendly/Persuasive/Concise) → returns Subject + Body + Closing.
- **Notes**: large textarea (meeting notes) → returns Summary, Key Decisions, Action Items, Deadlines, Risks.
- **Tasks**: dynamic task list (add/remove rows), plan mode (Daily/Weekly) → returns prioritized schedule + time estimates + tips.
- **Research**: topic input + optional focus → returns Executive Summary, Key Insights, Opportunities, Risks, Recommendations.
- **Chat**: full-height chat UI (composer at bottom, auto-scroll, disable submit while streaming, markdown rendering).

### Dashboard

- 4 metric cards: Emails Generated, Meetings Summarized, Tasks Planned, Research Reports — counters from `localStorage` (incremented on each successful generation).
- Quick-launch grid linking to each tool.
- Recent activity list (last 5 outputs from `localStorage`, click to reopen in tool).
- Responsible AI notice at bottom.

### Local persistence (no backend DB)

`src/lib/session-store.ts` — typed `localStorage` wrapper for `{ counters, recents[] }`. Cleared from Settings.

### Responsible AI

Reusable `ResponsibleAINotice` rendered in each tool page footer + on Settings page.

### Technical notes

- Stack: TanStack Start (existing template), Tailwind v4 (existing `src/styles.css`), shadcn (already present).
- Add deps: `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`, `react-markdown`.
- All AI calls server-side; `LOVABLE_API_KEY` is auto-provisioned and read only in server route handlers.
- Inter loaded via `<link>` in `__root.tsx` head; `--font-sans` token updated in `src/styles.css`.

### Out of scope (this pass)

- No login / no database / no per-user history beyond `localStorage`.
- No file upload (notes summarizer takes pasted text).
- No team/sharing features.

Ready to build when you approve.
