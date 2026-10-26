"use client";
import Link from "next/link";
import { Menu, X, Trophy } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [["Tournaments", "#tournaments"], ["Scrims", "#scrims"], ["Results", "#results"], ["About", "#about"], ["Updates", "#updates"]];
  return <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/75 backdrop-blur-xl">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
      <Link href="/" className="flex items-center gap-3">
        <img src="/images/battlexa-logo.png" alt="Battlexa logo" className="h-11 w-11 rounded-lg object-cover" />
        <span className="display text-xl font-black leading-none">BATTLEXA<span className="text-fuchsia-500">.</span><small className="mt-1 block font-sans text-[9px] tracking-[.23em] text-zinc-400">ESPORTS ARENA</small></span>
      </Link>
      <div className="hidden items-center gap-7 md:flex">{links.map(([label, href]) => <a key={label} href={href} className="text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:text-white">{label}</a>)}
        <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "#community"} target="_blank" rel="noreferrer" className="purple-button flex items-center gap-2 rounded-lg px-4 py-3 text-xs font-extrabold uppercase tracking-wider"><Trophy size={15}/> Join Community</a>
      </div>
      <button className="rounded-lg border border-white/15 p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
    </nav>
    {open && <div className="border-t border-white/10 bg-black px-5 py-4 md:hidden">{links.map(([label, href]) => <a key={label} onClick={() => setOpen(false)} href={href} className="block py-3 text-sm font-bold uppercase tracking-wider text-zinc-200">{label}</a>)}<a className="purple-button mt-3 block rounded-lg px-4 py-3 text-center text-sm font-bold" href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "#community"}>Join Discord</a></div>}
  </header>;
}
