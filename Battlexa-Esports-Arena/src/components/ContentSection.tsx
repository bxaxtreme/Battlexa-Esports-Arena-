import { CalendarDays, ChevronRight, Clock3, Trophy, Users, Newspaper } from "lucide-react";
import Reveal from "@/components/Reveal";

type Item = Record<string, unknown> & { _id?: string; id?: string; title?: string; date?: string; status?: string; description?: string; summary?: string; prizePool?: string; slots?: string; mode?: string; time?: string; winner?: string; runnerUp?: string; category?: string; registrationUrl?: string; bannerUrl?: string };
const icons = { tournaments: Trophy, scrims: Users, results: Trophy, news: Newspaper };
const headings = {
  tournaments: { kicker: "ENTER THE ARENA", title: "Featured Tournaments", copy: "Big moments start with one match. Find your next challenge." },
  scrims: { kicker: "PRACTICE. IMPROVE. REPEAT.", title: "Scrims & Practice", copy: "Sharpen your rotations, build chemistry, and get match-ready." },
  results: { kicker: "THE WINNERS CIRCLE", title: "Latest Results", copy: "The scoreboard never lies. Celebrate the teams making their mark." },
  news: { kicker: "FROM THE COMMAND CENTER", title: "Latest Updates", copy: "Announcements, event drops, and everything happening at Battlexa." }
};

export default function ContentSection({ kind, items }: { kind: keyof typeof headings; items: Item[] }) {
  const h = headings[kind];
  const Icon = icons[kind];
  return <section id={kind} className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
    <Reveal><div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="section-kicker">{h.kicker}</p><h2 className="display mt-3 text-5xl font-black md:text-7xl">{h.title}</h2><p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">{h.copy}</p></div><a href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "#community"} className="outline-button inline-flex w-fit items-center gap-2 rounded-lg px-4 py-3 text-xs font-extrabold uppercase tracking-wider">Get details <ChevronRight size={15}/></a></div></Reveal>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => <Reveal key={String(item._id || item.id || item.title || i)} delay={i * .07}><article className="panel group h-full overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/50">
        {kind === "tournaments" && item.bannerUrl && <img src={String(item.bannerUrl)} alt={`${item.title || "Tournament"} banner`} loading="lazy" className="h-44 w-full object-cover"/>}
        <div className="p-6">
        <div className="mb-6 flex items-start justify-between"><span className="rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/10 p-3 text-fuchsia-300"><Icon size={20}/></span><span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300">{String(item.status || item.category || (kind === "results" ? "Completed" : "Official"))}</span></div>
        <h3 className="display text-3xl font-bold leading-tight">{item.title || "Battlexa Arena Update"}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{String(item.description || item.summary || (kind === "results" ? `Champion: ${item.winner || "TBA"} · Runner-up: ${item.runnerUp || "TBA"}` : "Details will be announced soon on our official channels."))}</p>
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs text-zinc-400">
          {item.date && <span className="flex items-center gap-1.5"><CalendarDays size={13}/>{String(item.date)}</span>}
          {item.time && <span className="flex items-center gap-1.5"><Clock3 size={13}/>{String(item.time)}</span>}
          {item.mode && <span>{String(item.mode)}</span>}
        </div>
        {(item.prizePool || item.slots) && <div className="mt-5 flex gap-3">{item.prizePool && <div className="flex-1 rounded-lg bg-black/40 p-3"><p className="text-[10px] uppercase tracking-widest text-zinc-500">Prize Pool</p><p className="mt-1 font-extrabold text-fuchsia-200">{String(item.prizePool)}</p></div>}{item.slots && <div className="flex-1 rounded-lg bg-black/40 p-3"><p className="text-[10px] uppercase tracking-widest text-zinc-500">Slots</p><p className="mt-1 font-extrabold">{String(item.slots)}</p></div>}</div>}
        {kind === "tournaments" && item.registrationUrl && /registration\s*(open|opened)|register\s*now|open\s*for\s*registration/i.test(String(item.status || "")) && <a href={String(item.registrationUrl)} target="_blank" rel="noopener noreferrer" className="purple-button mt-5 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-xs font-extrabold uppercase tracking-wider">Register now <ChevronRight size={15}/></a>}
        </div>
      </article></Reveal>)}
    </div>
  </section>;
}
