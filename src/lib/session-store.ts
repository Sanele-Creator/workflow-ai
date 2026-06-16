export type ToolKey = "email" | "notes" | "tasks" | "research" | "chat";

export type RecentItem = {
  id: string;
  tool: ToolKey;
  title: string;
  preview: string;
  createdAt: number;
};

type Store = {
  counters: Record<ToolKey, number>;
  recents: RecentItem[];
};

const KEY = "awpa.store.v1";
const DEFAULT: Store = {
  counters: { email: 0, notes: 0, tasks: 0, research: 0, chat: 0 },
  recents: [],
};

function read(): Store {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function write(s: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("awpa:store-changed"));
}

export function getStore(): Store {
  return read();
}

export function recordGeneration(tool: ToolKey, title: string, preview: string) {
  const s = read();
  s.counters[tool] = (s.counters[tool] ?? 0) + 1;
  s.recents = [
    { id: crypto.randomUUID(), tool, title, preview: preview.slice(0, 160), createdAt: Date.now() },
    ...s.recents,
  ].slice(0, 20);
  write(s);
}

export function clearStore() {
  write(DEFAULT);
}

export function subscribe(fn: () => void) {
  const handler = () => fn();
  window.addEventListener("awpa:store-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("awpa:store-changed", handler);
    window.removeEventListener("storage", handler);
  };
}
