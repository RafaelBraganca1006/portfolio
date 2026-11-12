"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VT323 } from "next/font/google";

const lcd = VT323({ weight: "400", subsets: ["latin"] });

// Salamander Grand Piano samples (every minor third); other notes are pitch-shifted from the nearest one.
const ROOTS: Record<string, number> = {
  C3: 48, Ds3: 51, Fs3: 54, A3: 57, C4: 60, Ds4: 63, Fs4: 66, A4: 69, C5: 72, Ds5: 75, Fs5: 78, A5: 81, C6: 84,
};
const START = 60; // C4
const WHITES = 14; // two octaves
const IS_WHITE = [true, false, true, false, true, true, false, true, false, true, false, true];
// physical key positions (event.code), so the layout works on QWERTY, QWERTZ and AZERTY alike
const KEYMAP: Record<string, number> = {
  KeyA: 60, KeyW: 61, KeyS: 62, KeyE: 63, KeyD: 64, KeyF: 65, KeyT: 66, KeyG: 67, KeyY: 68, KeyH: 69, KeyU: 70, KeyJ: 71,
  KeyK: 72, KeyO: 73, KeyL: 74, KeyP: 75, Semicolon: 76,
};

type Song = { name: string; duration: number; notes: [number, number, number, number][]; pedal: [number, number][] };
const SONGS = [
  { id: "title", file: "/songs/title.json", label: "OCARINA OF TIME" },
  { id: "clair", file: "/songs/clair.json", label: "CLAIR DE LUNE" },
  { id: "mia", file: "/songs/mia.json", label: "MIA & SEBASTIAN'S THEME" },
  { id: "ipanema", file: "/songs/ipanema.json", label: "GIRL FROM IPANEMA" },
  { id: "misty", file: "/songs/misty.json", label: "MISTY" },
  { id: "passacaglia", file: "/songs/passacaglia.json", label: "PASSACAGLIA" },
] as const;

type Voice = { src: AudioBufferSourceNode; gain: GainNode };

function usePiano() {
  const ctx = useRef<AudioContext | null>(null);
  const bufs = useRef<Record<number, AudioBuffer>>({});
  const loading = useRef<Promise<void> | null>(null);
  const voices = useRef<Map<number, Voice>>(new Map());

  // Creates and unlocks the audio context (must run inside a user gesture, which Safari and iOS insist on)
  // and loads the samples once. A failed sample never blocks the others, and a failed load can be retried.
  const ready = useCallback(() => {
    if (!ctx.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx.current = new AC();
      try {
        const silent = ctx.current.createBufferSource();
        silent.buffer = ctx.current.createBuffer(1, 1, 22050);
        silent.connect(ctx.current.destination);
        silent.start(0);
      } catch {}
    }
    const c = ctx.current;
    if (c.state !== "running") void c.resume().catch(() => {});
    if (!loading.current) {
      loading.current = Promise.all(
        Object.entries(ROOTS).map(async ([name, midi]) => {
          try {
            const res = await fetch(`/audio/piano/${name}.mp3`);
            const data = await res.arrayBuffer();
            // callback form works on every Safari, the promise form only on newer ones
            bufs.current[midi] = await new Promise<AudioBuffer>((ok, fail) => c.decodeAudioData(data, ok, fail));
          } catch {}
        }),
      ).then(() => {
        if (Object.keys(bufs.current).length === 0) loading.current = null;
      });
    }
    return loading.current;
  }, []);

  const nearest = (midi: number) => {
    const have = Object.keys(bufs.current).map(Number);
    return have.reduce((a, b) => (Math.abs(b - midi) < Math.abs(a - midi) ? b : a), have[0]);
  };

  const stop = useCallback((midi: number) => {
    const v = voices.current.get(midi);
    const c = ctx.current;
    if (!v || !c) return;
    voices.current.delete(midi);
    const t = c.currentTime;
    v.gain.gain.cancelScheduledValues(t);
    v.gain.gain.setValueAtTime(v.gain.gain.value, t);
    v.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    v.src.stop(t + 0.65);
  }, []);

  const play = useCallback(
    async (midi: number) => {
      await ready();
      const c = ctx.current!;
      if (voices.current.has(midi)) stop(midi);
      if (Object.keys(bufs.current).length === 0) return;
      const root = nearest(midi);
      const src = c.createBufferSource();
      src.buffer = bufs.current[root];
      src.playbackRate.value = Math.pow(2, (midi - root) / 12);
      const gain = c.createGain();
      gain.gain.value = 0.9;
      src.connect(gain).connect(c.destination);
      src.start();
      voices.current.set(midi, { src, gain });
    },
    [ready, stop],
  );

  const schedule = useCallback((midi: number, at: number, off: number, vel: number, dest: AudioNode) => {
    const c = ctx.current!;
    const root = nearest(midi);
    const src = c.createBufferSource();
    src.buffer = bufs.current[root];
    src.playbackRate.value = Math.pow(2, (midi - root) / 12);
    const g = c.createGain();
    g.gain.setValueAtTime(0.25 + 0.65 * vel, at);
    const hold = Math.max(off, at + 0.4);
    g.gain.setValueAtTime(0.25 + 0.65 * vel, hold);
    g.gain.exponentialRampToValueAtTime(0.001, hold + 0.7);
    src.connect(g).connect(dest);
    src.start(at);
    src.stop(hold + 0.75);
    return src;
  }, []);

  return { play, stop, ready, schedule, ctx };
}

export default function PianoLine({
  before,
  trigger,
  after,
}: {
  before: React.ReactNode;
  trigger: React.ReactNode;
  after: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [down, setDown] = useState<Set<number>>(new Set());
  const [playing, setPlaying] = useState<string | null>(null);
  const { play, stop, ready, schedule, ctx } = usePiano();
  const song = useRef<{ stop: () => void } | null>(null);
  const cache = useRef<Record<string, Song>>({});

  // the mechanical "clack" of a preset button, synthesized: a short low thump plus a bright tick
  const clack = useCallback(() => {
    const c = ctx.current;
    if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(60, t + 0.05);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.08);
    const len = Math.floor(c.sampleRate * 0.02);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const n = c.createBufferSource();
    const ng = c.createGain();
    const f = c.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 2500;
    ng.gain.value = 0.25;
    n.buffer = buf;
    n.connect(f).connect(ng).connect(c.destination);
    n.start(t);
  }, [ctx]);

  const stopSong = useCallback(() => {
    song.current?.stop();
    song.current = null;
    setPlaying(null);
    setDown(new Set());
  }, []);

  const startSong = useCallback(
    async (id: string, file: string) => {
      stopSong();
      setPlaying(id);
      await ready();
      if (!cache.current[id]) cache.current[id] = await (await fetch(file)).json();
      const data = cache.current[id];
      const c = ctx.current!;
      const master = c.createGain();
      master.gain.value = 0.9;
      master.connect(c.destination);
      const t0 = c.currentTime + 0.35;
      const sources = data.notes.map(([t, m, d, v]) => schedule(m, t0 + t, t0 + t + d, v, master));
      let raf = 0;
      let last = "";
      const tick = () => {
        const now = c.currentTime - t0;
        if (now > data.duration + 0.5) {
          stopSong();
          return;
        }
        const on = new Set<number>();
        for (const [t, m, d] of data.notes) if (t <= now && now < t + Math.min(d, 1.4)) on.add(m);
        const key = [...on].sort().join(",");
        if (key !== last) {
          last = key;
          setDown(on);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      song.current = {
        stop: () => {
          cancelAnimationFrame(raf);
          const t = c.currentTime;
          master.gain.cancelScheduledValues(t);
          master.gain.setValueAtTime(master.gain.value, t);
          master.gain.linearRampToValueAtTime(0, t + 0.4);
          sources.forEach((s) => {
            try {
              s.stop(t + 0.45);
            } catch {}
          });
        },
      };
    },
    [ctx, ready, schedule, stopSong],
  );

  useEffect(() => () => song.current?.stop(), []);

  // unlock audio on the very first touch, click or key anywhere on the page, so the piano is ready when it opens
  useEffect(() => {
    const unlock = () => {
      void ready();
      for (const ev of ["pointerdown", "touchend", "click", "keydown"]) window.removeEventListener(ev, unlock);
    };
    for (const ev of ["pointerdown", "touchend", "click", "keydown"]) window.addEventListener(ev, unlock, { passive: true });
    return () => {
      for (const ev of ["pointerdown", "touchend", "click", "keydown"]) window.removeEventListener(ev, unlock);
    };
  }, [ready]);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      void ready();
    };
    window.addEventListener("open-piano", onOpen);
    return () => window.removeEventListener("open-piano", onOpen);
  }, [ready]);

  const close = useCallback(() => {
    stopSong();
    setOpen(false);
  }, [stopSong]);

  const press = useCallback(
    (m: number) => {
      setDown((d) => new Set(d).add(m));
      void play(m);
    },
    [play],
  );
  const release = useCallback(
    (m: number) => {
      setDown((d) => {
        const n = new Set(d);
        n.delete(m);
        return n;
      });
      stop(m);
    },
    [stop],
  );

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const held = new Set<string>();
    const kd = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const m = KEYMAP[e.code];
      if (m === undefined || held.has(e.code)) return;
      held.add(e.code);
      press(m);
    };
    const ku = (e: KeyboardEvent) => {
      const m = KEYMAP[e.code];
      if (m === undefined) return;
      held.delete(e.code);
      release(m);
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, [open, press, release]);

  const whites: number[] = [];
  const blacks: { midi: number; after: number }[] = [];
  let wi = 0;
  for (let m = START; m < START + 24; m++) {
    if (IS_WHITE[(m - START) % 12]) {
      whites.push(m);
      wi++;
    } else blacks.push({ midi: m, after: wi });
  }

  const handlers = (m: number) => ({
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      press(m);
    },
    onPointerUp: () => release(m),
    onPointerLeave: () => release(m),
    onPointerCancel: () => release(m),
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
      if (e.buttons === 1) press(m);
    },
  });

  return (
    <div>
      <p>
        {before}
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            void ready();
          }}
          aria-haspopup="dialog"
          className="cursor-pointer font-medium text-fg underline decoration-fg/40 underline-offset-[6px] outline-none transition hover:decoration-fg focus-visible:decoration-fg"
        >
          {trigger}
        </button>
        {after}
      </p>

      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition duration-500 ${open ? "visible bg-black/70 opacity-100 backdrop-blur-sm" : "invisible bg-black/0 opacity-0"}`}
        onMouseDown={(e) => e.target === e.currentTarget && close()}
        role="dialog"
        aria-modal="true"
        aria-label="Piano"
        aria-hidden={!open}
      >
        {/* the keyboard, in a walnut case with a brass control strip */}
        <div
          className={`relative w-full max-w-3xl select-none touch-none rounded-[22px] border border-[#6b4a2f] bg-[linear-gradient(180deg,#4a2f1d_0%,#2e1b10_100%)] p-3 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,220,170,0.25)] transition duration-500 sm:p-4 ${open ? "translate-y-0 scale-100" : "translate-y-6 scale-95"}`}
        >
          {/* control strip: retro display and numbered preset buttons, like an old keyboard */}
          <div className="mb-3 rounded-xl border border-[#8a6a3f]/40 bg-[linear-gradient(180deg,#d9c79c_0%,#b89a63_100%)] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(60,40,10,0.35)] sm:px-4">
            <div className="rounded-md border-2 border-[#3a2a14] bg-[#1e2a14] px-3 py-1.5 shadow-[inset_0_3px_8px_rgba(0,0,0,0.8)]">
              <p
                className={`${lcd.className} truncate text-2xl leading-none tracking-[0.12em] sm:text-3xl ${playing ? "text-[#b9f26b] [text-shadow:0_0_8px_rgba(185,242,107,0.7)]" : "text-[#b9f26b]/35"}`}
                aria-live="polite"
              >
                {playing ? `\u25B6 ${SONGS.find((x) => x.id === playing)?.label}` : "SELECT PRESET"}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 sm:gap-5">
              {SONGS.map((sg, i) => {
                const on = playing === sg.id;
                return (
                  <div key={sg.id} className="flex flex-col items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition duration-300 ${on ? "bg-[#ff5a3c] shadow-[0_0_8px_2px_rgba(255,90,60,0.8)]" : "bg-[#6b4a2f]/60"}`}
                    />
                    {/* classic keyboard preset key: a recessed slot with a tall plastic cap that sinks when pressed */}
                    <span className="block rounded-[7px] bg-[#24160c] p-[3px] shadow-[inset_0_3px_5px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.45)]">
                      <button
                        type="button"
                        tabIndex={open ? 0 : -1}
                        aria-label={`Preset ${i + 1}`}
                        aria-pressed={on}
                        onClick={() => {
                          void ready();
                          clack();
                          if (on) stopSong();
                          else void startSong(sg.id, sg.file);
                        }}
                        className={`block h-8 w-9 rounded-[4px] border-t border-white/70 outline-none transition-all duration-75 focus-visible:ring-2 focus-visible:ring-[#ff5a3c] sm:h-10 sm:w-14 ${
                          on
                            ? "translate-y-[5px] bg-[radial-gradient(ellipse_at_50%_20%,#e6dcc0_0%,#cfc19f_100%)] shadow-[0_1px_0_#7d6a42,inset_0_2px_4px_rgba(0,0,0,0.25)]"
                            : "bg-[radial-gradient(ellipse_at_50%_15%,#faf4e4_0%,#e2d6b8_60%,#d2c39f_100%)] shadow-[0_6px_0_#85714a,0_8px_5px_rgba(0,0,0,0.55),inset_0_-3px_4px_rgba(120,95,50,0.35)] hover:brightness-105"
                        }`}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative h-40 rounded-md bg-[#15171c] p-1 pt-0 shadow-[inset_0_6px_10px_rgba(0,0,0,0.8)] sm:h-52">
            <div className="relative flex h-full">
              {whites.map((m) => (
                <button
                  key={m}
                  type="button"
                  tabIndex={open ? 0 : -1}
                  aria-label={`Note ${m}`}
                  {...handlers(m)}
                  className={`h-full flex-1 rounded-b-md border-x border-black/25 transition-colors duration-100 ${
                    down.has(m) ? "bg-[#d8cfbf]" : "bg-[linear-gradient(180deg,#f7f2e6_0%,#efe8d8_100%)] hover:bg-[#ece7dc]"
                  }`}
                />
              ))}
              {blacks.map(({ midi, after }) => (
                <button
                  key={midi}
                  type="button"
                  tabIndex={-1}
                  aria-label={`Note ${midi}`}
                  {...handlers(midi)}
                  style={{ left: `${(after / WHITES) * 100}%`, width: `${(0.6 / WHITES) * 100}%`, transform: "translateX(-50%)" }}
                  className={`absolute top-0 h-[62%] rounded-b-md shadow-[0_4px_6px_rgba(0,0,0,0.5)] transition-colors duration-100 ${
                    down.has(midi) ? "bg-[#4a4f5c]" : "bg-[linear-gradient(180deg,#2c2f37_0%,#14161b_100%)] hover:bg-[#2f333d]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

