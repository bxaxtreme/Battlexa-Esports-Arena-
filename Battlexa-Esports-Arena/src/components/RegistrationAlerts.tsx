"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, X, Trophy, ArrowUpRight } from "lucide-react";

export type Tournament = {
  title?: string;
  status?: string;
  date?: string;
  time?: string;
  prizePool?: string;
  slots?: string;
  description?: string;
  registrationUrl?: string;
  bannerUrl?: string;
  id?: string;
  _id?: unknown;
};

function isRegistrationOpen(status?: string) {
  return /registration\s*(open|opened)|register\s*now|open\s*for\s*registration/i.test(status || "");
}

export default function RegistrationAlerts({ tournaments }: { tournaments: Tournament[] }) {
  const openTournaments = useMemo(
    () => tournaments.filter((item) => isRegistrationOpen(item.status)),
    [tournaments]
  );
  const [notice, setNotice] = useState<Tournament | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    if (!openTournaments.length) return;

    // Show a site notification once per tournament/status on this browser.
    try {
      const unseen = openTournaments.find((item) => {
        const key = `battlexa:tournament-notified:${String(item.id || item._id || item.title || "event")}:${item.status}`;
        return localStorage.getItem(key) !== "seen";
      });
      if (!unseen) return;
      setNotice(unseen);
      const key = `battlexa:tournament-notified:${String(unseen.id || unseen._id || unseen.title || "event")}:${unseen.status}`;
      localStorage.setItem(key, "seen");

      // Use native notifications only when permission was previously granted.
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New Battlexa Tournament", {
          body: `${unseen.title || "A tournament"} is open for registration.`,
          icon: "/images/battlexa-logo.png",
        });
      }
    } catch {
      // Private browsing/storage restrictions should not prevent the page from working.
      setNotice(openTournaments[0]);
    }
  }, [openTournaments]);

  if (!openTournaments.length) return null;
  const featured = openTournaments[0];

  return <>
    {bannerVisible && (
      <aside className="tournament-alert-banner relative isolate overflow-hidden border-y border-violet-300/20 bg-gradient-to-r from-[#210b3d] via-[#42117a] to-[#180b30] px-5 py-4 shadow-[0_10px_50px_rgba(126,34,206,.16)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(216,180,254,.2),transparent_50%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="alert-icon rounded-xl border border-violet-200/20 bg-white/10 p-2 text-violet-100"><Trophy size={20}/></span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.22em] text-violet-200">New tournament · Registration open</p>
              <p className="mt-1 text-base font-extrabold text-white">{featured.title || "A new Battlexa tournament is live!"}</p>
              <p className="mt-1 text-xs text-violet-100/80">{featured.date ? `Date: ${featured.date}` : "Limited slots may be available"}{featured.slots ? ` · ${featured.slots}` : ""}{featured.prizePool ? ` · Prize pool: ${featured.prizePool}` : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pl-11 sm:pl-0">
            {featured.registrationUrl && <a href={featured.registrationUrl} target="_blank" rel="noopener noreferrer" className="purple-button inline-flex items-center gap-2 rounded-lg px-4 py-3 text-[10px] font-black uppercase tracking-wider">Register now <ArrowUpRight size={14}/></a>}
            <a href="#tournaments" className="outline-button rounded-lg px-4 py-3 text-[10px] font-black uppercase tracking-wider">View event</a>
            <button aria-label="Dismiss tournament banner" onClick={() => setBannerVisible(false)} className="rounded-lg p-2 text-violet-100/80 transition hover:bg-white/10 hover:text-white"><X size={17}/></button>
          </div>
        </div>
      </aside>
    )}

    {notice && (
      <div className="fixed inset-x-4 top-20 z-[70] mx-auto max-w-md" role="status" aria-live="polite">
        <div className="tournament-toast panel rounded-2xl border border-violet-300/30 p-4 shadow-[0_20px_80px_rgba(0,0,0,.65)]">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-violet-500/20 p-2 text-violet-200"><BellRing size={20}/></span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-violet-300">New tournament alert</p>
              <p className="mt-1 font-extrabold text-white">{notice.title || "Registration is now open!"}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-300">{notice.description || "Registration is open. Check the event details and secure your slot."}</p>
              <a href={notice.registrationUrl || "#tournaments"} target={notice.registrationUrl ? "_blank" : undefined} rel={notice.registrationUrl ? "noopener noreferrer" : undefined} className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-violet-200 hover:text-white">View tournament <ArrowUpRight size={14}/></a>
            </div>
            <button onClick={() => setNotice(null)} aria-label="Close notification" className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"><X size={17}/></button>
          </div>
        </div>
      </div>
    )}
  </>;
}
