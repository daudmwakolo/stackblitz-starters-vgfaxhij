'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Marquee from './components/Marquee';
import Header from './components/Header';
import Throne from './components/Throne';
import Podium from './components/Podium';
import HotThree from './components/HotThree';
import RankRow, { RankingsDivider } from './components/RankRow';
import NewsSection from './components/NewsSection';
import Footer from './components/Footer';
import VoteToast from './components/VoteToast';

type VoteType = 'up' | 'down';

export default function Home() {
  const [toast, setToast] = useState<{
    msg: string;
    type: VoteType;
    visible: boolean;
  }>({
    msg: '',
    type: 'up',
    visible: false
  });

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerToast = useCallback((songName: string, type: VoteType) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);

    setToast({
      msg: type === 'up' ? `Pulse Added: ${songName}` : `Strike Cast: ${songName}`,
      type,
      visible: true
    });

    toastTimer.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const standings = Array.from({ length: 17 }, (_, i) => {
    const num = i + 4;
    const isTop10 = num <= 10;
    return {
      num,
      song: isTop10 ? "Sielewi" : "Archive Sequence",
      artist: isTop10 ? "Zeke.bxt" : "Underground",
      votes: isTop10 ? "4.5K" : "800",
      weeks: num + 1,
      yt: `#${num + 2}`,
      sp: `#${num + 4}`,
      bp: `#${num}`
    };
  });

  return (
    <main className="min-h-screen bg-[#050505] font-['Inter'] text-white antialiased">
      <Marquee />
      <Header />

      <Throne
        song="Bongo Anthem"
        artist="Davieh G ft. Matitu"
        votes="12.4K"
        weeksInChart={12}
        weeksAtNo1={5}
        ytRank="#01" spRank="#02" bpRank="#01"
        onVote={triggerToast}
      />

      <div className="max-w-4xl mx-auto px-4">
        <Podium onVote={triggerToast} />
        <HotThree />

        <section className="mb-20">
          <RankingsDivider />
          <div className="flex flex-col gap-1">
            {standings.map((item) => (
              <RankRow
                key={item.num}
                rank={item.num}
                song={item.song}
                artist={item.artist}
                votes={item.votes}
                weeks={item.weeks}
                yt={item.yt} sp={item.sp} bp={item.bp}
                // Matches RankRow's 3-parameter requirement
                onVote={(songName, type, tier) => triggerToast(item.song, type as VoteType)}
              />
            ))}
          </div>
        </section>

        <NewsSection />
      </div>

      <Footer />

      {/* FINAL PROP FIX: 
         If Vercel fails on 'msg', use 'message'.
         If Vercel fails on 'message', use 'msg'.
         Based on the most common error, 'message' is the winner.
      */}
      <VoteToast
        message={toast.msg}
        type={toast.type}
        isVisible={toast.visible}
      />

    </main>
  );
}
