import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import ZodiacCard from './ZodiacCard';
import RasiHelperSheet from './RasiHelperSheet';

type RasiCardData = {
  slug: string;
  teluguName: string;
  englishName: string;
  symbolName: string;
  symbolAsset?: string;
  dateRangeLabel?: string;
};

type Props = {
  items: RasiCardData[];
};

export default function ZodiacScroller({ items }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeSlug, setActiveSlug] = useState(items[0]?.slug ?? '');
  const [isHelperOpen, setHelperOpen] = useState(false);
  const basePath = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const storedOffset = window.sessionStorage.getItem('ugadi-rasi-scroll-left');
    if (storedOffset) {
      scroller.scrollLeft = Number(storedOffset);
    }

    const handleScroll = () => {
      window.sessionStorage.setItem('ugadi-rasi-scroll-left', String(scroller.scrollLeft));
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      const closest = items.reduce<{ slug: string; distance: number } | null>((result, item) => {
        const target = document.getElementById(`rasi-card-${item.slug}`);
        if (!target) {
          return result;
        }
        const cardCenter = target.offsetLeft + target.clientWidth / 2;
        const distance = Math.abs(center - cardCenter);
        if (!result || distance < result.distance) {
          return { slug: item.slug, distance };
        }
        return result;
      }, null);

      if (closest) {
        setActiveSlug(closest.slug);
      }
    };

    handleScroll();
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  const activeItem = useMemo(
    () => items.find((item) => item.slug === activeSlug) ?? items[0],
    [activeSlug, items],
  );

  const selectRasi = (slug: string) => {
    window.sessionStorage.setItem('ugadi-rasi-scroll-left', String(scrollerRef.current?.scrollLeft ?? 0));
    window.dispatchEvent(new CustomEvent('ugadi:play', { detail: { sound: 'bell' } }));
    window.setTimeout(() => {
      window.location.assign(`${basePath}rasi/${slug}/`);
    }, 140);
  };

  return (
    <>
      <section className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="panel rounded-[2rem] px-5 py-5"
        >
          <p className="section-kicker">Rasi Phalalu Selection</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[2.4rem] leading-none text-[var(--text)]">
                Select Your Rasi
              </h1>
              <p className="mt-2 max-w-[17rem] text-sm leading-6 text-[var(--muted)]">
                Choose your Janma Rashi to open the annual English reading for Sri Parabhava Nama
                Samvatsara.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                Active
              </p>
              <p className="font-display text-2xl text-[var(--accent)]">{activeItem?.englishName}</p>
            </div>
          </div>
        </motion.div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <div id={`rasi-card-${item.slug}`} key={item.slug}>
              <ZodiacCard
                index={index}
                active={activeSlug === item.slug}
                englishName={item.englishName}
                teluguName={item.teluguName}
                symbolAsset={item.symbolAsset}
                symbolName={item.symbolName}
                onFocus={() => setActiveSlug(item.slug)}
                onSelect={() => selectRasi(item.slug)}
              />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.15 }}
          className="panel rounded-[1.75rem] px-5 py-5"
        >
          <p className="section-kicker">Need Help?</p>
          <h2 className="mt-2 font-display text-[2rem] text-[var(--text)]">Don&apos;t know your Rasi?</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            The Ugadi reading is based on Janma Rashi, also known as the Moon Sign.
          </p>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('ugadi:play', { detail: { sound: 'click' } }));
              setHelperOpen(true);
            }}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(214,179,106,0.34)] px-4 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text)]"
          >
            Find my Rasi
          </button>
        </motion.div>
      </section>

      <RasiHelperSheet isOpen={isHelperOpen} onClose={() => setHelperOpen(false)} />
    </>
  );
}
