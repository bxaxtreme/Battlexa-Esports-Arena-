import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import ContentSection from "@/components/ContentSection";
import RegistrationAlerts, { type Tournament } from "@/components/RegistrationAlerts";
import { getDb } from "@/lib/db";
import { sampleContent } from "@/lib/seed";
import { ArrowUpRight, ChevronDown, Crown, Gamepad2, ShieldCheck, Users, Zap } from "lucide-react";

async function getItems(collection: keyof typeof sampleContent) {
  try {
    const db = await getDb();
    const items = await db.collection(collection).find({}).sort({ createdAt: -1 }).limit(6).toArray();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error(`Unable to load ${collection}:`, error instanceof Error ? error.message : error);
    return sampleContent[collection] as unknown as Record<string, unknown>[];
  }
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const [tournaments, scrims, results, news] = await Promise.all([getItems("tournaments"), getItems("scrims"), getItems("results"), getItems("news")]);
  return <main className="overflow-hidden">
    <Navbar/>
    <RegistrationAlerts tournaments={tournaments as unknown as Tournament[]}/>
    <section className="site-grid relative flex min-h-[820px] items-center px-5 pb-20 pt-32 md:min-h-[920px] md:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(119,24,255,.22),transparent_40%),radial-gradient(ellipse_at_25%_70%,rgba(90,24,180,.12),transparent_35%)]"/>
      <div className="pointer-events-none absolute right-[-12%] top-[18%] h-[520px] w-[520px] rounded-full border border-fuchsia-500/10 pulse-glow md:right-[3%] md:h-[650px] md:w-[650px]"><div className="absolute inset-10 rounded-full border border-violet-400/10"/><div className="absolute inset-24 rounded-full border border-violet-400/10"/></div>
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <Reveal><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-fuchsia-500/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-fuchsia-200"><span className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-400"/> Free Fire Esports Organisation</div></Reveal>
          <Reveal delay={.08}><h1 className="display max-w-3xl text-7xl font-black leading-[.86] tracking-tight sm:text-8xl lg:text-[112px]">PLAY WITH<br/><span className="text-gradient">PURPOSE.</span><br/>RISE AS <span className="text-fuchsia-500">ONE.</span></h1></Reveal>
          <Reveal delay={.16}><p className="mt-7 max-w-xl text-sm leading-7 text-zinc-300 md:text-base">Welcome to Battlexa Esports Arena — where hungry squads compete, communities grow, and the next generation of Free Fire talent gets its stage.</p></Reveal>
          <Reveal delay={.24}><div className="mt-8 flex flex-wrap gap-3"><a href="#tournaments" className="purple-button inline-flex items-center gap-2 rounded-lg px-6 py-4 text-xs font-extrabold uppercase tracking-wider">Explore tournaments <ArrowUpRight size={16}/></a><a href="#about" className="outline-button rounded-lg px-6 py-4 text-xs font-extrabold uppercase tracking-wider">Our story</a></div></Reveal>
          <Reveal delay={.32}><div className="mt-12 grid max-w-xl grid-cols-3 border-t border-white/10 pt-6"><div><p className="display text-4xl font-black">3K<span className="text-fuchsia-400">+</span></p><p className="mt-1 text-[9px] uppercase tracking-[.16em] text-zinc-500">Discord family</p></div><div><p className="display text-4xl font-black">2025</p><p className="mt-1 text-[9px] uppercase tracking-[.16em] text-zinc-500">Founded</p></div><div><p className="display text-4xl font-black">FF<span className="text-fuchsia-400">MAX</span></p><p className="mt-1 text-[9px] uppercase tracking-[.16em] text-zinc-500">Our battlefield</p></div></div></Reveal>
        </div>
        <Reveal delay={.2} className="relative mx-auto w-full max-w-[540px]"><div className="absolute inset-10 rounded-full bg-violet-600/20 blur-3xl"/><img src="/images/battlexa-logo.png" alt="Battlexa Esports Arena emblem" className="floaty relative z-10 w-full drop-shadow-[0_20px_65px_rgba(137,35,255,.3)]"/><div className="panel absolute bottom-1 left-1 z-20 flex items-center gap-3 rounded-xl px-4 py-3"><span className="rounded-lg bg-fuchsia-500/15 p-2 text-fuchsia-300"><Zap size={19}/></span><div><p className="text-xs font-extrabold">YOUR NEXT CHAPTER</p><p className="mt-1 text-[10px] text-zinc-400">Starts in the arena.</p></div></div></Reveal>
      </div>
      <a href="#tournaments" className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[9px] uppercase tracking-[.24em] text-zinc-500">Scroll to explore <ChevronDown size={15}/></a>
    </section>
    <section className="border-y border-white/10 bg-[#0a090f] px-5 py-5 md:px-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[10px] font-extrabold uppercase tracking-[.2em] text-zinc-400 md:justify-between"><span className="flex items-center gap-2"><TrophyIcon/> Competitive tournaments</span><span className="flex items-center gap-2"><Gamepad2 size={16} className="text-fuchsia-400"/> Free Fire focused</span><span className="flex items-center gap-2"><Users size={16} className="text-fuchsia-400"/> Community first</span><span className="flex items-center gap-2"><ShieldCheck size={16} className="text-fuchsia-400"/> Fair-play mindset</span></div></section>
    <ContentSection kind="tournaments" items={tournaments as never[]}/>
    <div className="border-y border-white/5 bg-[#09080d]"><ContentSection kind="scrims" items={scrims as never[]}/></div>
    <ContentSection kind="results" items={results as never[]}/>
    <section id="about" className="site-grid relative border-y border-white/10 bg-[#0b0911] px-5 py-24 md:px-8 md:py-32"><div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center"><Reveal><p className="section-kicker">THE ORGANISATION</p><h2 className="display mt-4 text-6xl font-black leading-[.95] md:text-8xl">BUILT BY<br/><span className="text-gradient">PASSION.</span><br>DRIVEN BY<br/>COMPETITION.</h2><p className="mt-6 max-w-lg text-sm leading-7 text-zinc-400">Founded on <strong className="text-white">10 December 2025</strong>, Battlexa Esports Arena is a Free Fire esports organisation with a growing community of 3,000+ Discord members. Our mission is to create a place where players can compete, connect, and level up together.</p><div className="mt-8 flex gap-3"><span className="rounded-xl border border-white/10 bg-white/[.03] p-4"><Crown className="text-fuchsia-300"/></span><div><p className="font-extrabold">A stage for rising talent</p><p className="mt-1 text-xs leading-6 text-zinc-400">From community scrims to organised events, every match is a chance to grow.</p></div></div></Reveal>
      <div className="grid gap-4 sm:grid-cols-2"><Founder name="Sachin" delay={0}/><Founder name="Xtreme" delay={.1}/></div>
    </div></section>
    <ContentSection kind="news" items={news as never[]}/>
    <section id="community" className="px-5 py-20 md:px-8 md:py-28"><Reveal><div className="glow relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-fuchsia-300/20 bg-gradient-to-br from-[#24103d] via-[#100b1a] to-[#09080d] px-7 py-14 text-center md:px-16 md:py-20"><div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl"/><p className="section-kicker">YOUR SQUAD IS WAITING</p><h2 className="display relative mt-4 text-5xl font-black md:text-8xl">READY TO MAKE<br/><span className="text-gradient">YOUR MARK?</span></h2><p className="relative mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-300">Join the Battlexa community for tournament announcements, scrim schedules, and the latest results.</p><a href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "#"} target="_blank" rel="noreferrer" className="purple-button relative mt-8 inline-flex items-center gap-2 rounded-lg px-7 py-4 text-xs font-extrabold uppercase tracking-wider">Join 3K+ community <ArrowUpRight size={16}/></a></div></Reveal></section>
    <footer className="border-t border-white/10 bg-black px-5 py-8 md:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><img src="/images/battlexa-logo.png" alt="" className="h-10 w-10 rounded-lg object-cover"/><div><p className="display text-xl font-black">BATTLEXA ESPORTS ARENA</p><p className="mt-1 text-[10px] text-zinc-500">Built for the next generation of Free Fire esports.</p></div></div><div className="flex flex-wrap gap-5 text-xs text-zinc-400"><a href="#tournaments" className="hover:text-white">Tournaments</a><a href="#scrims" className="hover:text-white">Scrims</a><a href="#results" className="hover:text-white">Results</a><a href="/admin" className="hover:text-white">Admin</a></div><p className="text-[10px] text-zinc-600">© {new Date().getFullYear()} Battlexa Esports Arena.</p></div></footer>
  </main>;
}

function TrophyIcon() { return <Crown size={16} className="text-fuchsia-400"/>; }

function Founder({ name, delay }: { name: string; delay: number }) {
  return <Reveal delay={delay}><div className="panel group relative flex min-h-[290px] flex-col justify-end overflow-hidden rounded-2xl p-5"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(151,43,255,.2),transparent_60%)]"/><div className="absolute left-1/2 top-8 flex h-36 w-36 -translate-x-1/2 items-center justify-center rounded-full border border-dashed border-fuchsia-300/35 bg-black/30 text-center"><Users size={35} className="text-fuchsia-200/70"/><span className="absolute bottom-[-18px] rounded-full border border-white/10 bg-[#111018] px-3 py-1 text-[9px] uppercase tracking-widest text-zinc-500">Portrait space</span></div><div className="relative"><p className="section-kicker">FOUNDER & CEO</p><h3 className="display mt-1 text-4xl font-black">{name}</h3><p className="mt-2 text-xs leading-5 text-zinc-400">Leading the vision. Building the arena.</p></div></div></Reveal>;
}
