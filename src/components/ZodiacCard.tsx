import { motion } from 'motion/react';

type CardProps = {
  englishName: string;
  teluguName: string;
  symbolName: string;
  symbolAsset?: string;
  active: boolean;
  index: number;
  onFocus: () => void;
  onSelect: () => void;
};

export default function ZodiacCard({
  englishName,
  teluguName,
  symbolName,
  symbolAsset,
  active,
  index,
  onFocus,
  onSelect,
}: CardProps) {
  return (
    <motion.button
      type="button"
      onFocus={onFocus}
      onMouseEnter={onFocus}
      onClick={onSelect}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.45 }}
      whileTap={{ scale: 0.98 }}
      className={[
        'group relative w-[14.5rem] shrink-0 snap-center rounded-[2rem] border px-4 py-5 text-left transition duration-300',
        active
          ? 'border-[rgba(214,179,106,0.55)] bg-[linear-gradient(180deg,rgba(28,45,72,0.98),rgba(15,26,42,0.95))] shadow-[0_20px_70px_rgba(6,12,25,0.65)]'
          : 'border-[rgba(214,179,106,0.18)] bg-[linear-gradient(180deg,rgba(16,27,45,0.9),rgba(10,18,31,0.9))] shadow-[0_16px_44px_rgba(4,10,18,0.42)]',
      ].join(' ')}
      aria-label={`${englishName} ${symbolName}`}
    >
      <span
        className={[
          'absolute inset-0 rounded-[2rem] transition duration-300',
          active ? 'bg-[radial-gradient(circle_at_top,rgba(214,179,106,0.16),transparent_55%)]' : '',
        ].join(' ')}
      />
      <div className="relative z-10">
        <div
          className={[
            'mx-auto flex h-30 w-30 items-center justify-center overflow-hidden rounded-full border transition duration-300',
            active
              ? 'border-[rgba(214,179,106,0.65)] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,rgba(214,179,106,0.18),rgba(35,25,11,0.2))]'
              : 'border-[rgba(214,179,106,0.26)] bg-[linear-gradient(180deg,rgba(214,179,106,0.1),rgba(19,29,46,0.18))]',
          ].join(' ')}
        >
          {symbolAsset ? (
            <img
              src={symbolAsset}
              alt={`${englishName} sign art`}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <span className="font-display text-lg leading-none text-[var(--accent)]">{englishName}</span>
          )}
        </div>
        <p className="mt-5 text-[0.72rem] uppercase tracking-[0.3em] text-[var(--muted)]">{teluguName}</p>
        <h3 className="mt-2 font-display text-3xl text-[var(--text)]">{englishName}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{symbolName}</p>
      </div>
    </motion.button>
  );
}
