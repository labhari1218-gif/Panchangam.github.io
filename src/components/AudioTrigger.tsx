import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    __ugadiPlaySound?: (sound?: 'click' | 'bell') => void;
  }
}

type Sounds = {
  click: import('howler').Howl | null;
  bell: import('howler').Howl | null;
};

export default function AudioTrigger() {
  const soundsRef = useRef<Sounds>({ click: null, bell: null });
  const loadingRef = useRef(false);
  const basePath = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  useEffect(() => {
    let mounted = true;

    const ensureLoaded = async () => {
      if (!mounted || loadingRef.current || soundsRef.current.click) {
        return soundsRef.current;
      }

      loadingRef.current = true;
      const { Howl } = await import('howler');

      if (!mounted) {
        return soundsRef.current;
      }

      soundsRef.current.click = new Howl({
        src: [`${basePath}audio/click.mp3`],
        volume: 0.35,
        preload: true,
      });
      soundsRef.current.bell = new Howl({
        src: [`${basePath}audio/bell.mp3`],
        volume: 0.25,
        preload: true,
      });
      loadingRef.current = false;
      return soundsRef.current;
    };

    const preload = () => {
      void ensureLoaded();
      window.removeEventListener('pointerdown', preload);
      window.removeEventListener('keydown', preload);
    };

    const play = async (sound: 'click' | 'bell' = 'click') => {
      const sounds = await ensureLoaded();
      sounds[sound]?.play();
    };

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ sound?: 'click' | 'bell' }>;
      void play(customEvent.detail?.sound ?? 'click');
    };

    window.__ugadiPlaySound = (sound) => {
      void play(sound ?? 'click');
    };

    window.addEventListener('pointerdown', preload, { once: true });
    window.addEventListener('keydown', preload, { once: true });
    window.addEventListener('ugadi:play', handleCustomEvent as EventListener);

    return () => {
      mounted = false;
      delete window.__ugadiPlaySound;
      window.removeEventListener('pointerdown', preload);
      window.removeEventListener('keydown', preload);
      window.removeEventListener('ugadi:play', handleCustomEvent as EventListener);
    };
  }, []);

  return null;
}
