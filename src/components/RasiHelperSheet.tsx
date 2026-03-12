import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { trackEvent } from '../lib/analytics';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const primaryUrl =
  'https://www.drikpanchang.com/utilities/horoscope/hindu-moonsign-calculator.html';
const secondaryUrl = 'https://www.astrosage.com/rasi-calculator.asp';

export default function RasiHelperSheet({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    trackEvent('rasi_helper_open');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close Rasi helper"
            className="fixed inset-0 z-40 bg-[rgba(3,7,14,0.72)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-x-3 bottom-3 z-50 rounded-[2rem] border border-[rgba(214,179,106,0.28)] bg-[linear-gradient(180deg,rgba(20,35,61,0.98),rgba(9,17,31,0.98))] p-5 shadow-[0_24px_80px_rgba(4,10,18,0.62)] md:inset-x-auto md:left-1/2 md:top-1/2 md:w-[26rem] md:-translate-x-1/2 md:-translate-y-1/2"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rasi-helper-title"
          >
            <p className="section-kicker">Rasi Helper</p>
            <h3 id="rasi-helper-title" className="mt-2 font-display text-4xl text-[var(--text)]">
              Don&apos;t know your Rasi?
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Your Ugadi reading is based on Janma Rashi (Moon Sign). To identify it correctly,
              please use your birth date, birth time, and place of birth.
            </p>
            <p className="mt-2 text-xs leading-5 text-[rgba(246,239,221,0.68)]">
              Exact birth time and birthplace improve accuracy.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href={primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 w-full items-center justify-center rounded-full border border-[rgba(214,179,106,0.38)] bg-[linear-gradient(135deg,rgba(214,179,106,0.2),rgba(156,47,31,0.16))] px-5 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text)]"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('ugadi:play', { detail: { sound: 'click' } }));
                  trackEvent('rasi_helper_primary_click', { provider: 'drik_panchang' });
                }}
              >
                Find my Rasi
              </a>
              <a
                href={secondaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-[var(--muted)] underline decoration-[rgba(214,179,106,0.35)] underline-offset-4"
                onClick={() => {
                  trackEvent('rasi_helper_secondary_click', { provider: 'astrosage' });
                }}
              >
                Fallback: Try AstroSage
              </a>
              <button
                type="button"
                onClick={onClose}
                className="mx-auto block text-sm font-medium text-[var(--text)]/90 underline decoration-[rgba(214,179,106,0.4)] underline-offset-4"
              >
                I already know my Rasi
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
