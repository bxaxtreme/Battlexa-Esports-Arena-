export const sampleContent = {
  tournaments: [
    {
      title: "BATTLEXA CLASH — SEASON 01",
      game: "Free Fire MAX",
      mode: "Squad",
      status: "Registration Open",
      date: "2026-11-15",
      time: "18:00 IST",
      prizePool: "Coming Soon",
      slots: "48 Teams",
      description: "The arena is calling. Build your squad and get ready to compete.",
      registrationUrl: "",
      bannerUrl: ""
    }
  ],
  scrims: [
    {
      title: "Daily Practice Scrims",
      tier: "Open",
      mode: "Squad",
      date: "Daily",
      time: "Schedule announced on Discord",
      slots: "Limited slots",
      status: "Upcoming",
      roomInfo: "Room ID and password shared with confirmed teams.",
      registrationUrl: ""
    }
  ],
  results: [
    {
      title: "Official results will appear here",
      date: "—",
      winner: "Awaiting first event",
      runnerUp: "—",
      mvp: "—",
      prizePool: "—",
      standings: []
    }
  ],
  news: [
    {
      title: "Welcome to Battlexa Esports Arena",
      date: "2026-10-26",
      category: "Organisation",
      summary: "A new home for Free Fire competition, community, and rising talent.",
      content: "Battlexa Esports Arena is building a competitive community for Free Fire esports. Follow this space for tournament announcements, scrim schedules, match results, and organisation updates.",
      imageUrl: ""
    }
  ]
} as const;
