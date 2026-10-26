"use client";
import { useEffect, useState } from "react";
import { LogOut, Plus, RefreshCw, Save, Trash2, ShieldCheck, Trophy, Newspaper, Users } from "lucide-react";

type Collection = "tournaments" | "scrims" | "results" | "news";
type Row = { id?: string; title?: string; [key: string]: unknown };
const collections: { key: Collection; label: string; icon: typeof Trophy; sample: Record<string, unknown> }[] = [
  { key: "tournaments", label: "Tournaments", icon: Trophy, sample: { title: "New tournament", game: "Free Fire MAX", mode: "Squad", status: "Registration Open", date: "2026-11-15", time: "18:00 IST", prizePool: "Coming Soon", slots: "48 Teams", description: "", registrationUrl: "", bannerUrl: "" } },
  { key: "scrims", label: "Scrims", icon: Users, sample: { title: "Daily scrims", tier: "Open", mode: "Squad", date: "Daily", time: "", slots: "", status: "Upcoming", roomInfo: "", registrationUrl: "" } },
  { key: "results", label: "Results", icon: Trophy, sample: { title: "Event results", date: "", winner: "", runnerUp: "", mvp: "", prizePool: "", standings: [] } },
  { key: "news", label: "News & Updates", icon: Newspaper, sample: { title: "New announcement", date: new Date().toISOString().slice(0,10), category: "Announcement", summary: "", content: "", imageUrl: "" } }
];

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState<Collection>("tournaments");
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Row | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [json, setJson] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load(collection = active) {
    setBusy(true); setError("");
    try {
      const res = await fetch(`/api/admin/${collection}`, { cache: "no-store" });
      const data = await res.json();
      if (res.status === 401) { setLoggedIn(false); return; }
      if (!res.ok) throw new Error(data.error || "Could not load data");
      setRows(data); setMessage("");
    } catch (e) { setError(e instanceof Error ? e.message : "Request failed"); }
    finally { setBusy(false); }
  }
  useEffect(() => { if (loggedIn) void load(active); }, [loggedIn, active]);

  async function login(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setLoggedIn(true); setPassword(""); setMessage("Welcome to the command center.");
    } catch (e) { setError(e instanceof Error ? e.message : "Login failed"); }
    finally { setBusy(false); }
  }
  function choose(row: Row | null) { setSelected(row); setEditorOpen(true); setJson(JSON.stringify(row ? Object.fromEntries(Object.entries(row).filter(([k]) => k !== "id")) : collections.find(c => c.key === active)!.sample, null, 2)); setError(""); setMessage(""); }
  async function save() {
    setBusy(true); setError(""); setMessage("");
    try {
      const parsed = JSON.parse(json);
      const editing = selected?.id;
      const res = await fetch(editing ? `/api/admin/${active}/${editing}` : `/api/admin/${active}`, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMessage(editing ? "Item updated successfully." : "New item created successfully.");
      setSelected(null); setEditorOpen(false); await load(active);
    } catch (e) { setError(e instanceof Error ? e.message : "Invalid JSON"); }
    finally { setBusy(false); }
  }
  async function remove(row: Row) {
    if (!row.id || !confirm(`Delete "${row.title || "this item"}"? This cannot be undone.`)) return;
    setBusy(true); setError("");
    try {
      const res = await fetch(`/api/admin/${active}/${row.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMessage("Item deleted."); await load(active);
      if (selected?.id === row.id) { setSelected(null); setEditorOpen(false); }
    } catch (e) { setError(e instanceof Error ? e.message : "Delete failed"); }
    finally { setBusy(false); }
  }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setLoggedIn(false); setRows([]); setSelected(null); }

  if (!loggedIn) return <main className="site-grid flex min-h-screen items-center justify-center px-5 py-12"><div className="panel w-full max-w-md rounded-3xl p-8"><div className="mb-7 flex items-center gap-3"><img src="/images/battlexa-logo.png" alt="" className="h-14 w-14 rounded-xl object-cover"/><div><p className="display text-3xl font-black">COMMAND CENTER</p><p className="text-xs text-zinc-400">Battlexa Esports Arena</p></div></div><div className="mb-6 rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-xs leading-5 text-fuchsia-100"><ShieldCheck className="mb-2" size={19}/>Secure admin access. Your session is stored in an HTTP-only cookie.</div><form onSubmit={login} className="space-y-4"><label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Username<input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-400"/></label><label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-400"/></label><button disabled={busy} className="purple-button w-full rounded-xl px-4 py-3 text-sm font-extrabold">{busy ? "Signing in…" : "Sign in to dashboard"}</button></form>{error && <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}<a href="/" className="mt-6 block text-center text-xs text-zinc-500 hover:text-white">← Back to website</a></div></main>;

  return <main className="min-h-screen bg-[#07070b]"><header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><div className="flex items-center gap-3"><img src="/images/battlexa-logo.png" alt="" className="h-10 w-10 rounded-lg object-cover"/><div><p className="display text-2xl font-black">COMMAND CENTER</p><p className="text-[10px] uppercase tracking-widest text-zinc-500">Battlexa content management</p></div></div><div className="flex gap-2"><button onClick={() => load()} className="outline-button rounded-lg p-2.5" aria-label="Refresh"><RefreshCw size={16}/></button><button onClick={logout} className="outline-button flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"><LogOut size={15}/> Logout</button></div></div></header>
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[250px_1fr]"><aside className="panel h-fit rounded-2xl p-3"><p className="px-3 py-3 text-[10px] font-extrabold uppercase tracking-[.2em] text-zinc-500">Manage content</p>{collections.map(c => { const Icon = c.icon; return <button key={c.key} onClick={() => { setActive(c.key); setSelected(null); setEditorOpen(false); setJson(""); }} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold ${active === c.key ? "bg-fuchsia-500/15 text-fuchsia-200" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}><Icon size={17}/>{c.label}</button>; })}<a href="/" className="mt-4 block border-t border-white/10 px-3 pt-4 text-xs text-zinc-500 hover:text-white">← View public website</a></aside>
      <section><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><p className="section-kicker">CONTENT CONTROL</p><h1 className="display mt-1 text-5xl font-black">{collections.find(c => c.key === active)?.label}</h1><p className="mt-2 text-xs text-zinc-500">{rows.length} item(s) · Changes are saved to MongoDB</p></div><button onClick={() => choose(null)} className="purple-button flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold uppercase tracking-wider"><Plus size={16}/> Create item</button></div>
      {message && <p className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}{error && <p className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      {editorOpen && <div className="panel mb-6 rounded-2xl p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-extrabold">{selected.id ? "Edit item" : "Create item"}</h2><button onClick={() => { setSelected(null); setEditorOpen(false); }} className="text-xs text-zinc-400 hover:text-white">Cancel</button></div><p className="mb-3 text-xs leading-5 text-zinc-500">Edit the fields as JSON. A <code className="text-fuchsia-300">title</code> field is required. Keep valid JSON syntax.</p><textarea value={json} onChange={e => setJson(e.target.value)} spellCheck={false} className="min-h-[300px] w-full rounded-xl border border-white/10 bg-[#08080c] p-4 font-mono text-xs leading-6 text-emerald-100 outline-none focus:border-fuchsia-400"/><button disabled={busy} onClick={save} className="purple-button mt-4 flex items-center gap-2 rounded-lg px-5 py-3 text-xs font-extrabold"><Save size={15}/>{busy ? "Saving…" : "Save changes"}</button></div>}
      <div className="grid gap-3">{busy && rows.length === 0 ? <p className="p-8 text-center text-sm text-zinc-500">Loading content…</p> : rows.map(row => <article key={row.id || String(row.title)} className="panel flex flex-col justify-between gap-4 rounded-xl p-4 sm:flex-row sm:items-center"><div className="min-w-0"><p className="font-bold">{row.title || "Untitled item"}</p><p className="mt-1 truncate text-xs text-zinc-500">{String(row.date || row.status || row.category || "No extra details")} {row.id ? `· ID ${row.id}` : ""}</p></div><div className="flex shrink-0 gap-2"><button onClick={() => choose(row)} className="outline-button rounded-lg px-3 py-2 text-xs font-bold">Edit JSON</button><button onClick={() => remove(row)} className="rounded-lg border border-red-400/20 bg-red-500/5 p-2 text-red-300 hover:bg-red-500/15" aria-label="Delete item"><Trash2 size={15}/></button></div></article>)}{!busy && rows.length === 0 && <div className="panel rounded-2xl p-10 text-center"><p className="font-bold">No saved items yet</p><p className="mt-2 text-xs text-zinc-500">Create your first {active.slice(0, -1)} item to publish it on the website.</p></div>}</div>
      </section></div></main>;
}
