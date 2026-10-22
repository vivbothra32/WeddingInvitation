"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Clock3,
  Copy,
  Flame,
  Flower2,
  Hand,
  Landmark,
  MapPin,
  Maximize2,
  Menu,
  Music,
  Music2,
  Pause,
  Phone,
  Share2,
  Sun,
  Volume2,
  X,
  type LucideIcon,
} from "lucide-react";
import wedding, {
  type EventIcon,
  type WeddingEvent,
} from "@/data/wedding";

const navigation = [
  ["Home", "home"],
  ["Celebrations", "celebrations"],
  ["Our Story", "story"],
  ["Gallery", "gallery"],
  ["Venue", "venue"],
] as const;

const petalGlyphs = ["✿", "❀", "✾", "❁", "✽", "❋"];
const petalColors = ["234, 190, 190", "216, 184, 106", "245, 214, 204", "205, 140, 150", "255, 240, 214"];
// Deterministic values keep server and client markup identical.
const petals = Array.from({ length: 44 }, (_, i) => ({
  left: (i * 37 + (i % 5) * 7) % 100,
  size: [10, 14, 20, 28, 36, 16, 24, 12][i % 8],
  duration: 14 + ((i * 7) % 13),
  delay: -((i * 5.3) % 24),
  drift: ((i % 7) - 3) * 22,
  spin: 180 + (i % 5) * 90,
  glyph: petalGlyphs[i % petalGlyphs.length],
  color: petalColors[(i * 3) % petalColors.length],
  opacity: 0.32 + (i % 4) * 0.12,
}));

const confettiColors = ["#d8b86a", "#f6e3a1", "#c04a62", "#f2a7b4", "#fff5e4", "#7fb69a", "#e8843c"];

function PartyPoppers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();

    type Piece = { x: number; y: number; vx: number; vy: number; size: number; rot: number; vr: number; color: string; shape: number; life: number; tilt: number };
    const pieces: Piece[] = [];
    const burst = (side: 1 | -1, count: number) => {
      const speedBase = Math.min(Math.max(height, 520) * 0.034, 30);
      for (let i = 0; i < count; i++) {
        // Aim up and towards the centre from each bottom corner.
        const angle = (Math.PI / 180) * (side === 1 ? 292 + Math.random() * 52 : 248 - Math.random() * 52);
        const speed = speedBase * (0.45 + Math.random() * 0.75);
        pieces.push({
          x: side === 1 ? 6 : width - 6,
          y: height - 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 6 + Math.random() * 8,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.4,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          shape: Math.floor(Math.random() * 3),
          life: 0,
          tilt: Math.random() * Math.PI * 2,
        });
      }
    };

    const timers = [0, 380, 760].flatMap((delay, index) => [
      window.setTimeout(() => burst(1, 70 - index * 10), delay),
      window.setTimeout(() => burst(-1, 70 - index * 10), delay),
    ]);

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.42;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.tilt += 0.18;
        p.life += 1;
        if (p.y > height + 30 || p.life > 260) { pieces.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.min(1, (260 - p.life) / 60);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 0) ctx.fillRect(-p.size / 2, (-p.size / 4) * Math.abs(Math.cos(p.tilt)), p.size, (p.size / 2) * Math.abs(Math.cos(p.tilt)) + 1);
        else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2); ctx.fill(); }
        else {
          ctx.beginPath();
          for (let k = 0; k < 10; k++) {
            const r = k % 2 === 0 ? p.size / 2 : p.size / 5;
            const a = (Math.PI / 5) * k;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      timers.forEach(window.clearTimeout);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="popper-canvas" aria-hidden="true" />;
}

function formatDate(date: string | null) {
  if (!date || Number.isNaN(Date.parse(date))) return "Date to be announced";
  const parts = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!parts) return "Date to be announced";
  const stableDate = new Date(Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]), 12));
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(stableDate);
}

function formatTime(time: string | null) {
  if (!time) return null;
  const parsed = new Date(`2000-01-01T${time}`);
  return Number.isNaN(parsed.getTime()) ? time : new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(parsed);
}

function safeHttpUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function safeMapEmbedUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !["www.google.com", "maps.google.com"].includes(url.hostname) || !url.pathname.startsWith("/maps")) return null;
    return url.href;
  } catch {
    return null;
  }
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: reduced ? 0 : 0.65, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AssetImage({ src, alt, className, fill, sizes, width, height, priority }: { src: string; alt: string; className?: string; fill?: boolean; sizes?: string; width?: number; height?: number; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  // Images that failed before hydration never fire React's onError, so check the element once mounted.
  const check = (node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth === 0) setFailed(true);
  };
  if (failed) return null;
  return fill
    ? <Image ref={check} src={src} alt={alt} className={className} fill sizes={sizes} priority={priority} onError={() => setFailed(true)} />
    : <Image ref={check} src={src} alt={alt} className={className} width={width} height={height} priority={priority} onError={() => setFailed(true)} />;
}

function Logo({ className = "", size = 48 }: { className?: string; size?: number }) {
  return <AssetImage src={wedding.assets.logo} alt="" className={`logo-mark ${className}`} width={size} height={size} />;
}

function SectionHeading({ eyebrow, title, subtitle, titleId, light = false }: { eyebrow: string; title: string; subtitle?: string; titleId?: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? "section-heading-light" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={titleId}>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      <span className="ornament" aria-hidden="true"><i />✦<i /></span>
    </div>
  );
}

function FamilyCard({ label, names }: { label: string; names: string }) {
  return (
    <article className="family-card">
      <span className="family-corner corner-tl" aria-hidden="true">❧</span>
      <span className="family-corner corner-tr" aria-hidden="true">❧</span>
      <span className="family-corner corner-bl" aria-hidden="true">❧</span>
      <span className="family-corner corner-br" aria-hidden="true">❧</span>
      <h3 className="family-label">{label}</h3>
      <span className="ornament" aria-hidden="true"><i />❦<i /></span>
      <p className="family-names">
        {names.split(" & ").map((name, index) => (
          <span key={name}>{index > 0 && <em aria-hidden="true">&amp;</em>}<strong>{name}</strong></span>
        ))}
      </p>
    </article>
  );
}

function EventCalendarActions({ event }: { event: WeddingEvent }) {
  const start = event.calendarStart ? Date.parse(event.calendarStart) : Number.NaN;
  const end = event.calendarEnd ? Date.parse(event.calendarEnd) : Number.NaN;
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
  const address = wedding.privacy.hideFullAddresses ? null : event.address;
  const details = [event.venueName, address].filter(Boolean).join("\n");
  const google = new URL("https://calendar.google.com/calendar/render");
  google.searchParams.set("action", "TEMPLATE");
  google.searchParams.set("text", event.name);
  google.searchParams.set("dates", `${new Date(start).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}/${new Date(end).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`);
  if (event.venueName || address) google.searchParams.set("location", [event.venueName, address].filter(Boolean).join(", "));
  google.searchParams.set("details", details);

  function downloadICS() {
    const stamp = (date: number) => new Date(date).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const escapeICS = (value: string) => value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const body = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN", "BEGIN:VEVENT",
      `UID:${event.id}-${start}@wedding-invitation`,
      `DTSTAMP:${stamp(Date.now())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:${escapeICS(event.name)}`, `DESCRIPTION:${escapeICS(details)}`,
      ...(event.venueName || address ? [`LOCATION:${escapeICS([event.venueName, address].filter(Boolean).join(", "))}`] : []),
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
    link.download = `${event.id}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="calendar-actions">
      <button className="text-action" type="button" onClick={downloadICS}><CalendarDays size={15} /> Add to calendar</button>
      <a className="text-action" href={google.href} target="_blank" rel="noreferrer"><ArrowRight size={15} /> Google Calendar</a>
    </div>
  );
}

const eventIcons: Record<EventIcon, LucideIcon> = {
  flower: Flower2,
  hand: Hand,
  music: Music,
  sun: Sun,
  flame: Flame,
};

function formatEventDay(date: string | null) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})/.exec(date ?? "");
  if (!parts) return "Date to be announced";
  const day = Number(parts[3]);
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  const month = new Intl.DateTimeFormat("en-IN", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(Number(parts[1]), Number(parts[2]) - 1, day, 12)));
  return `${day}${suffix} ${month}`;
}

const DRAG_THRESHOLD = 5;
const FLICK_DISTANCE = 40;

function EventCarousel({ events, reducedMotion }: { events: WeddingEvent[]; reducedMotion: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0, startIndex: 0 });
  const [dragging, setDragging] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardTarget = useCallback((track: HTMLDivElement, card: HTMLElement) => card.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || "0"), []);

  const nearestIndex = useCallback((track: HTMLDivElement) => {
    const cards = Array.from(track.children) as HTMLElement[];
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) return cards.length - 1;
    let best = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(cardTarget(track, card) - track.scrollLeft);
      if (distance < bestDistance) { best = index; bestDistance = distance; }
    });
    return best;
  }, [cardTarget]);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
    setActiveIndex(nearestIndex(track));
  }, [nearestIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const card = cards[Math.min(Math.max(index, 0), cards.length - 1)];
    if (card) track.scrollTo({ left: cardTarget(track, card), behavior: reducedMotion ? "auto" : "smooth" });
  }, [cardTarget, reducedMotion]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { active: true, moved: false, startX: event.clientX, startScroll: track.scrollLeft, startIndex: nearestIndex(track) };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state.active) return;
    const delta = event.clientX - state.startX;
    if (!state.moved) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      state.moved = true;
      track.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    track.scrollLeft = state.startScroll - delta;
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state.active) return;
    state.active = false;
    if (!state.moved) return;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    const delta = event.clientX - state.startX;
    let target = nearestIndex(track);
    if (target === state.startIndex && Math.abs(delta) > FLICK_DISTANCE) target += delta < 0 ? 1 : -1;
    scrollToIndex(target);
    setDragging(false);
  }

  function onClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!drag.current.moved) return;
    drag.current.moved = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight") { event.preventDefault(); scrollToIndex(activeIndex + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); scrollToIndex(activeIndex - 1); }
  }

  return (
    <motion.div
      className="event-carousel"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reducedMotion ? 0 : 0.1 } } }}
    >
      <button className="carousel-arrow carousel-prev" type="button" aria-label="Previous celebration" onClick={() => scrollToIndex(activeIndex - 1)} disabled={!canPrev}><ArrowLeft size={20} /></button>
      <div
        className={`event-track ${dragging ? "is-dragging" : ""}`}
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Wedding celebrations. Swipe, drag, or use the arrows to browse."
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        onDragStartCapture={(event) => event.preventDefault()}
      >
        {events.map((event, index) => {
          const Icon = eventIcons[event.icon];
          const mapUrl = !wedding.privacy.hideFullAddresses ? safeHttpUrl(event.mapUrl) : null;
          const time = formatTime(event.startTime);
          return (
            <motion.div
              className="event-slide"
              key={event.id}
              variants={{ hidden: { opacity: 0, y: reducedMotion ? 0 : 28 }, show: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.6, ease: [0.2, 0.7, 0.2, 1] } } }}
            >
              <article className={`event-card event-${event.accentColor}`} aria-label={`${event.name}, ${index + 1} of ${events.length}`}>
                <span className="event-number">0{index + 1}</span>
                <span className="event-symbol" aria-hidden="true"><Icon size={22} strokeWidth={1.6} /></span>
                <span className="event-kicker">The celebration</span>
                <h3>{event.name}</h3>
                <div className="event-info">
                  <p className="event-detail"><CalendarDays size={16} aria-hidden="true" /><span><small>Date</small>{formatEventDay(event.date)}</span></p>
                  {time && <p className="event-detail"><Clock3 size={16} aria-hidden="true" /><span><small>Time</small>{time.toUpperCase()}</span></p>}
                  {event.venueName && <p className="event-detail"><Landmark size={16} aria-hidden="true" /><span><small>Venue</small>{event.venueName}</span></p>}
                  {event.address && !wedding.privacy.hideFullAddresses && <p className="event-detail"><MapPin size={16} aria-hidden="true" /><span><small>Location</small>{event.address}</span></p>}
                </div>
                {(mapUrl || (event.calendarStart && event.calendarEnd)) && (
                  <div className="event-actions">
                    {mapUrl && <a className="text-action" href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> View map</a>}
                    <EventCalendarActions event={event} />
                  </div>
                )}
              </article>
            </motion.div>
          );
        })}
      </div>
      <button className="carousel-arrow carousel-next" type="button" aria-label="Next celebration" onClick={() => scrollToIndex(activeIndex + 1)} disabled={!canNext}><ArrowRight size={20} /></button>
      <div className="event-dots" role="group" aria-label="Choose a celebration">
        {events.map((event, index) => (
          <button key={event.id} type="button" className={index === activeIndex ? "is-active" : ""} aria-label={`Go to ${event.name}`} aria-current={index === activeIndex} onClick={() => scrollToIndex(index)} />
        ))}
      </div>
    </motion.div>
  );
}

export default function WeddingInvitation() {
  const [coverOpen, setCoverOpen] = useState(true);
  const [doorsOpening, setDoorsOpening] = useState(false);
  const [poppersActive, setPoppersActive] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicUnavailable, setMusicUnavailable] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const openInvitationRef = useRef<HTMLButtonElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const sceneOffset = useTransform(scrollY, [0, 800], [0, 55]);

  const enabledEvents = useMemo(() => wedding.events.filter((event) => event.enabled), []);
  const gallery = wedding.gallery;

  useEffect(() => {
    try {
      setCoverOpen(sessionStorage.getItem("sakshi-vivek-invitation-opened") !== "true");
    } catch {
      setCoverOpen(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.25, 0.5] });
    navigation.forEach(([, id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!wedding.weddingDate || Number.isNaN(Date.parse(wedding.weddingDate))) return;
    const update = () => setCountdown(Math.max(0, Date.parse(wedding.weddingDate!) - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const track = galleryTrackRef.current;
    if (!track) return;
    const update = () => {
      setCanScrollPrev(track.scrollLeft > 4);
      setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scrollGallery(direction: 1 | -1) {
    const track = galleryTrackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: reducedMotion ? "auto" : "smooth" });
  }

  useEffect(() => {
    if (lightboxIndex === null) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lightboxCloseRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex((index) => index === null ? 0 : (index + 1) % gallery.length);
      if (event.key === "ArrowLeft") setLightboxIndex((index) => index === null ? 0 : (index - 1 + gallery.length) % gallery.length);
      if (event.key === "Tab") {
        const controls = document.querySelectorAll<HTMLElement>(".lightbox button");
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [lightboxIndex, gallery.length]);

  useEffect(() => {
    if (!coverOpen) {
      heroTitleRef.current?.focus();
      return;
    }
    openInvitationRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        openInvitationRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [coverOpen]);

  const openInvitation = () => {
    if (doorsOpening) return;
    try { sessionStorage.setItem("sakshi-vivek-invitation-opened", "true"); } catch { /* Session storage can be disabled. */ }
    setDoorsOpening(true);
    if (!reducedMotion) {
      window.setTimeout(() => setPoppersActive(true), 500);
      window.setTimeout(() => setPoppersActive(false), 6500);
    }
    window.setTimeout(() => setCoverOpen(false), reducedMotion ? 0 : 1900);
    try {
      if (localStorage.getItem("sakshi-vivek-music-opt-in") === "true") void toggleMusic();
    } catch { /* Music remains optional when storage is disabled. */ }
  };

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio || !wedding.theme.enableMusic) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
      try { localStorage.setItem("sakshi-vivek-music-opt-in", "false"); } catch { /* Preference storage is optional. */ }
      return;
    }
    try {
      await audio.play();
      setMusicPlaying(true);
      setMusicUnavailable(false);
      try { localStorage.setItem("sakshi-vivek-music-opt-in", "true"); } catch { /* Preference storage is optional. */ }
    } catch {
      setMusicUnavailable(true);
      setMusicPlaying(false);
    }
  }

  async function shareInvitation() {
    const url = window.location.href;
    const text = wedding.social.whatsappShareText;
    try {
      if (navigator.share) await navigator.share({ title: `${wedding.couple.displayName} | Wedding Invitation`, text, url });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShareStatus("Invitation link copied.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareStatus("Sharing is unavailable here. You can copy the page address from your browser.");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("Invitation link copied.");
    } catch {
      setShareStatus("Copy is unavailable here. You can copy the page address from your browser.");
    }
  }

  function saveWeddingDate() {
    if (!wedding.weddingDate || Number.isNaN(Date.parse(wedding.weddingDate))) return;
    const dateParts = /^(\d{4})-(\d{2})-(\d{2})/.exec(wedding.weddingDate);
    if (!dateParts) return;
    const start = new Date(Date.UTC(Number(dateParts[1]), Number(dateParts[2]) - 1, Number(dateParts[3])));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    const toICSDate = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, "");
    const escapeICS = (value: string) => value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const body = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN", "BEGIN:VEVENT",
      `UID:wedding-${toICSDate(start)}@wedding-invitation`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      `DTSTART;VALUE=DATE:${toICSDate(start)}`, `DTEND;VALUE=DATE:${toICSDate(end)}`,
      `SUMMARY:${escapeICS(`${wedding.couple.displayName} — Wedding`)}`,
      `DESCRIPTION:${escapeICS(wedding.social.whatsappShareText)}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const objectUrl = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "wedding.ics";
    link.click();
    URL.revokeObjectURL(objectUrl);
  }

  const dateLabel = wedding.weddingDate ? formatDate(wedding.weddingDate) : "Wedding date to be announced";
  const countdownParts = countdown !== null && countdown > 0 ? {
    days: Math.floor(countdown / 86_400_000),
    hours: Math.floor((countdown / 3_600_000) % 24),
    minutes: Math.floor((countdown / 60_000) % 60),
    seconds: Math.floor((countdown / 1_000) % 60),
  } : null;

  return (
    <>
      <a className="skip-link" href="#main">Skip to invitation</a>
      {wedding.theme.showPetals && (
        <div className="petal-overlay" aria-hidden="true">
          {petals.map((petal, index) => (
            <span
              key={index}
              style={{
                left: `${petal.left}%`,
                fontSize: `${petal.size}px`,
                color: `rgba(${petal.color}, ${petal.opacity})`,
                animationDuration: `${petal.duration}s`,
                animationDelay: `${petal.delay}s`,
                ["--drift" as string]: `${petal.drift}px`,
                ["--spin" as string]: `${petal.spin}deg`,
              }}
            >{petal.glyph}</span>
          ))}
        </div>
      )}
      {wedding.theme.enableMusic && (
        <>
          <audio ref={audioRef} src={wedding.theme.musicPath} loop preload="none" onError={() => setMusicUnavailable(true)} />
          {!coverOpen && (
            <button
              className={`music-control ${musicPlaying ? "is-playing" : ""}`}
              type="button"
              onClick={() => void toggleMusic()}
              aria-label={musicPlaying ? "Pause background music" : "Play background music"}
              title={musicUnavailable ? "Add a licensed audio file to enable music" : musicPlaying ? "Pause music" : "Play music"}
            >
              {musicPlaying ? <Pause size={17} /> : musicUnavailable ? <Volume2 size={17} /> : <Music2 size={17} />}
              <span className="sr-only">{musicPlaying ? "Music playing" : musicUnavailable ? "Music unavailable" : "Music paused"}</span>
              {musicPlaying && <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>}
            </button>
          )}
        </>
      )}

      <header className={`site-header ${scrolled || coverOpen ? "header-solid" : ""}`}>
        <a className="brand" href="#home" onClick={() => setIsNavOpen(false)} aria-label={`${wedding.couple.displayName} home`}>
          <Logo className="brand-logo" size={44} />
          <span className="brand-name">{wedding.couple.displayName}</span>
        </a>
        <button className="mobile-menu-toggle" type="button" aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isNavOpen} onClick={() => setIsNavOpen(!isNavOpen)}>
          {isNavOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${isNavOpen ? "nav-open" : ""}`} aria-label="Main navigation">
          {navigation.map(([label, id]) => (
            <a key={id} className={activeSection === id ? "nav-active" : ""} href={`#${id}`} onClick={() => setIsNavOpen(false)}>{label}</a>
          ))}
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          {wedding.couple.heroImage && <AssetImage className="hero-photo" src={wedding.couple.heroImage} alt="" fill priority sizes="100vw" />}
          <motion.div className="hero-scene" style={{ y: wedding.theme.enableParallax && !reducedMotion ? sceneOffset : 0 }} aria-hidden="true">
            <div className="sun-disc" />
            <div className="arch arch-back" />
            <div className="arch arch-front" />
            <div className="garden-hill hill-left" />
            <div className="garden-hill hill-right" />
            <span className="hero-flower flower-a">✿</span>
            <span className="hero-flower flower-b">✽</span>
            <span className="hero-flower flower-c">✿</span>
            <span className="hero-leaf leaf-a">❧</span>
            <span className="hero-leaf leaf-b">❧</span>
          </motion.div>
          <div className="hero-shade" />
          <div className="hero-copy">
            <Logo className="hero-logo" size={96} />
            <span className="eyebrow hero-eyebrow">{wedding.invitation.eyebrow}</span>
            <span className="hero-rule" aria-hidden="true"><i />✦<i /></span>
            <motion.h1 ref={heroTitleRef} tabIndex={-1} id="hero-title" initial={reducedMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 1 }}>
              {wedding.couple.brideFirstName}<span className="ampersand"> &amp; </span>{wedding.couple.groomFirstName}
            </motion.h1>
            <p className="hero-tagline">{wedding.couple.shortIntroduction}</p>
            <p className="hero-date">{dateLabel}<span>{wedding.couple.locationLabel}</span></p>
            <div className="hero-buttons">
              {wedding.weddingDate && <button className="button button-outline-light" type="button" onClick={saveWeddingDate}><CalendarDays size={16} /> Save the date</button>}
              <a className="button button-light" href="#celebrations"><CalendarDays size={16} /> View celebrations</a>
            </div>
          </div>
          <a className="scroll-cue" href="#invitation" aria-label="Scroll to invitation message"><span>Scroll to discover</span><ArrowDown size={17} /></a>
          <div className="hero-frame" aria-hidden="true" />
        </section>

        <section className="invitation section-pad" id="invitation">
          <Reveal className="invitation-inner">
            <span className="eyebrow">{wedding.invitation.eyebrow}</span>
            <h2>{wedding.invitation.heading}</h2>
            <span className="lotus-mark" aria-hidden="true">❋</span>
            <p className="invitation-message">{wedding.invitation.message}</p>
            <div className="family-grid">
              <FamilyCard label={wedding.families.brideFamilyLabel} names={wedding.families.brideFamilyNames} />
              <span className="family-divider" aria-hidden="true">✦</span>
              <FamilyCard label={wedding.families.groomFamilyLabel} names={wedding.families.groomFamilyNames} />
            </div>
          </Reveal>
        </section>

        <section className="couple section-pad" aria-labelledby="couple-title">
          <div className="couple-layout">
            <Reveal className="couple-art">
              <div className="portrait-frame">
                {wedding.couple.portraitImage && <AssetImage src={wedding.couple.portraitImage} alt={`Portrait of ${wedding.couple.displayName}`} fill sizes="(max-width: 760px) 90vw, 440px" className="portrait-image" />}
                <div className="portrait-sun" />
                <div className="portrait-arch" />
                <div className="portrait-shade" aria-hidden="true" />
                <Logo className="portrait-logo" size={72} />
                <span className="portrait-caption">A story written together</span>
              </div>
              <span className="couple-stamp" aria-hidden="true">FOREVER<br />BEGINS</span>
            </Reveal>
            <Reveal className="couple-text">
              <span className="eyebrow">The two of us</span>
              <h2 id="couple-title">A little about<br /><em>our hearts</em></h2>
              <p>{wedding.couple.shortIntroduction}</p>
              <div className="bio-row">{wedding.couple.bridePortraitImage ? <Image className="bio-portrait" src={wedding.couple.bridePortraitImage} alt={`${wedding.couple.brideFirstName} portrait`} width={56} height={56} /> : <span className="bio-initial">{wedding.couple.brideFirstName[0]}</span>}<div><h3>{wedding.couple.brideFirstName}</h3><p>{wedding.couple.brideIntroduction}</p></div></div>
              <div className="bio-row">{wedding.couple.groomPortraitImage ? <Image className="bio-portrait" src={wedding.couple.groomPortraitImage} alt={`${wedding.couple.groomFirstName} portrait`} width={56} height={56} /> : <span className="bio-initial">{wedding.couple.groomFirstName[0]}</span>}<div><h3>{wedding.couple.groomFirstName}</h3><p>{wedding.couple.groomIntroduction}</p></div></div>
              <p className="couple-closing">Together, we can’t wait to begin our next chapter.</p>
            </Reveal>
          </div>
        </section>

        <section className="countdown section-pad">
          <div className="countdown-glow" aria-hidden="true" />
          <Reveal>
            <span className="eyebrow">The beginning of forever</span>
            <h2>Counting the moments</h2>
            {countdown === null ? (
              <p className="countdown-placeholder">The date will be shared soon</p>
            ) : countdownParts ? (
              <div className="countdown-grid" aria-label="Time remaining until the wedding">
                {Object.entries(countdownParts).map(([unit, value]) => (
                  <div className="countdown-unit" key={unit}><strong>{String(value).padStart(2, "0")}</strong><span>{unit}</span></div>
                ))}
              </div>
            ) : <p className="countdown-placeholder">The celebration has begun</p>}
            {wedding.weddingDate && <p className="countdown-date">{formatDate(wedding.weddingDate)}</p>}
          </Reveal>
        </section>

        <section className="events section-pad" id="celebrations">
          <div className="section-wrap">
            <SectionHeading eyebrow="A gathering of hearts" title="Wedding Celebrations" />
            <EventCarousel events={enabledEvents} reducedMotion={Boolean(reducedMotion)} />
          </div>
        </section>

        <section className="story section-pad" id="story">
          <div className="section-wrap">
            <SectionHeading eyebrow="A journey, made sweeter together" title="Our Love Story" />
            <ol className="story-timeline">
              {wedding.story.filter((entry) => entry.enabled).map((entry, index) => (
                <motion.li
                  key={entry.title}
                  className={`story-item ${index % 2 === 0 ? "story-left" : "story-right"}`}
                  initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.14 }}
                  transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <article className="story-card">
                    <span className="story-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    {entry.dateLabel && <span className="eyebrow">{entry.dateLabel}</span>}
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </article>
                  <div className="story-media">
                    {entry.image && <AssetImage className="story-image" src={entry.image} alt={`${entry.title} memory`} fill sizes="(max-width: 760px) 92vw, 460px" />}
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section className="gallery-section section-pad" id="gallery">
          <div className="section-wrap">
            <SectionHeading eyebrow="Little moments, held close" title="A Gallery of Us" />
            <div className="gallery-carousel">
              <button className="carousel-arrow carousel-prev" type="button" aria-label="Previous photographs" onClick={() => scrollGallery(-1)} disabled={!canScrollPrev}><ArrowLeft size={20} /></button>
              <motion.div
                className="gallery-track"
                ref={galleryTrackRef}
                role="region"
                aria-roledescription="carousel"
                aria-label="Photo gallery. Swipe or use the arrows to browse."
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: reducedMotion ? 0 : 0.09 } } }}
              >
                {gallery.map((image, index) => (
                  <motion.div
                    className="gallery-slide"
                    style={{ ["--ratio" as string]: `${image.width / image.height}` }}
                    key={`${image.alt}-${index}`}
                    variants={{ hidden: { opacity: 0, x: reducedMotion ? 0 : 48, scale: reducedMotion ? 1 : 0.96 }, show: { opacity: 1, x: 0, scale: 1, transition: { duration: reducedMotion ? 0 : 0.6, ease: [0.2, 0.7, 0.2, 1] } } }}
                  >
                    <button className={`gallery-tile gallery-${image.color}`} type="button" onClick={() => setLightboxIndex(index)} aria-label={`Open photograph ${index + 1} of ${gallery.length}: ${image.alt}`}>
                      {image.src ? <AssetImage src={image.src} alt="" fill sizes="(max-width: 760px) 86vw, 720px" className="gallery-photo" /> : <span className="gallery-art" aria-hidden="true"><span>✿</span><i /><b /></span>}
                      <span className="gallery-index">0{index + 1}</span>
                      <span className="gallery-preview" aria-hidden="true">
                        <span className="gallery-category">{image.category}</span>
                        <span className="gallery-label">{image.src ? image.alt : "A photograph will bloom here"}</span>
                        <span className="gallery-view"><Maximize2 size={14} /> View</span>
                      </span>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
              <button className="carousel-arrow carousel-next" type="button" aria-label="Next photographs" onClick={() => scrollGallery(1)} disabled={!canScrollNext}><ArrowRight size={20} /></button>
            </div>
            <p className="gallery-caption">Our favorite memories, with a few more to come.</p>
          </div>
        </section>

        <section className="venue section-pad" id="venue">
          <div className="venue-ornament" aria-hidden="true">✦</div>
          <div className="section-wrap">
            <SectionHeading eyebrow="We’ll save you a place" title="Find Your Way" />
            {wedding.venues.length > 0 ? (
              <div className="venue-grid">
                {wedding.venues.map((venue, index) => (
                  <article className="venue-card" key={`${venue.name}-${index}`}>
                    <span className="eyebrow">{venue.eventIds.map((id) => wedding.events.find((event) => event.id === id)?.shortTitle).filter(Boolean).join(" · ")}</span>
                    <h3>{venue.name ?? "Venue details to follow"}</h3>
                    {venue.address && <p>{wedding.privacy.hideFullAddresses ? "Full address will be shared closer to the celebration." : venue.address}</p>}
                    {venue.landmark && <p className="venue-landmark">{venue.landmark}</p>}
                    {venue.parkingNote && <p className="venue-note"><strong>Parking</strong>{venue.parkingNote}</p>}
                    {venue.accessibilityNote && <p className="venue-note"><strong>Accessibility</strong>{venue.accessibilityNote}</p>}
                    <div className="venue-actions">
                      {!wedding.privacy.hideFullAddresses && safeHttpUrl(venue.mapUrl) && <a className="button button-primary" href={safeHttpUrl(venue.mapUrl)!} target="_blank" rel="noreferrer"><MapPin size={16} /> Open in Maps</a>}
                      {wedding.privacy.showContactNumbers && venue.contactNumber && <a className="text-action" href={`tel:${venue.contactNumber}`}><Volume2 size={15} />{venue.contactName ?? "Call venue"}</a>}
                    </div>
                    {!wedding.privacy.hideFullAddresses && safeMapEmbedUrl(venue.mapEmbedUrl) && <iframe className="venue-map" src={safeMapEmbedUrl(venue.mapEmbedUrl)!} title={`Map for ${venue.name ?? "wedding venue"}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
                  </article>
                ))}
              </div>
            ) : (
              <div className="venue-placeholder">
                <span className="venue-pin" aria-hidden="true"><MapPin size={23} /></span>
                <h3>A beautiful place awaits</h3>
                <p>Venue and travel details will be shared as soon as they are confirmed.</p>
                <span className="venue-placeholder-line">Location details to follow</span>
              </div>
            )}
            {wedding.privacy.showContactNumbers && wedding.contacts.length > 0 && (
              <div className="venue-contacts">{wedding.contacts.map((contact) => <p key={`${contact.label}-${contact.number}`}><span>{contact.label}</span><a href={`tel:${contact.number}`}>{contact.name} · {contact.number}</a></p>)}</div>
            )}
          </div>
        </section>

        <section className="correspondence section-pad" id="correspondence" aria-labelledby="correspondence-title">
          <div className="section-wrap">
            <SectionHeading eyebrow={wedding.correspondence.eyebrow} title={wedding.correspondence.title} subtitle={wedding.correspondence.subtitle} titleId="correspondence-title" />
            <div className="contact-grid">
              {[
                { side: wedding.families.brideFamilyLabel, ...wedding.correspondence.brideSide },
                { side: wedding.families.groomFamilyLabel, ...wedding.correspondence.groomSide },
              ].map((contact) => (
                <Reveal key={contact.id} className="contact-reveal">
                  <article className="contact-card">
                    <span className="family-corner corner-tl" aria-hidden="true">❧</span>
                    <span className="family-corner corner-tr" aria-hidden="true">❧</span>
                    <span className="family-corner corner-bl" aria-hidden="true">❧</span>
                    <span className="family-corner corner-br" aria-hidden="true">❧</span>
                    <span className="eyebrow contact-side">{contact.side}</span>
                    <div className="contact-photo">
                      {contact.photo ? <AssetImage src={contact.photo} alt={`Portrait of ${contact.name}`} fill sizes="132px" className="contact-photo-image" /> : <span aria-hidden="true">{contact.name[0]}</span>}
                    </div>
                    <h3 className="contact-heading">{contact.heading}</h3>
                    <span className="ornament" aria-hidden="true"><i />❦<i /></span>
                    <p className="contact-name">{contact.name}</p>
                    <a className="contact-phone" href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}><Phone size={15} aria-hidden="true" />{contact.phone}</a>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="share-section section-pad" aria-labelledby="share-title">
          <Reveal className="share-inner">
            <Logo className="share-logo" size={64} />
            <span className="eyebrow">Pass the joy along</span>
            <h2 id="share-title">Share the invitation</h2>
            <p>{wedding.social.whatsappShareText}</p>
            <div className="share-actions">
              <button className="button button-primary" type="button" onClick={() => void shareInvitation()}><Share2 size={16} /> Share invitation</button>
              <a className="button button-outline-dark" href="https://wa.me/" target="_blank" rel="noreferrer" onClick={(event) => { event.preventDefault(); window.open(`https://wa.me/?text=${encodeURIComponent(`${wedding.social.whatsappShareText} ${window.location.href}`)}`, "_blank", "noopener,noreferrer"); }}>WhatsApp</a>
              <button className="button button-outline-dark" type="button" onClick={() => void copyLink()}><Copy size={15} /> Copy link</button>
            </div>
            <p className="share-status" aria-live="polite">{shareStatus}</p>
          </Reveal>
        </section>

        <footer className="closing">
          <a className="back-top" href="#home" aria-label="Back to top"><ArrowUp size={17} /></a>
          <Logo className="closing-logo" size={80} />
          <span className="eyebrow">With love,</span>
          <h2>{wedding.couple.displayName}</h2>
          <p>{wedding.couple.closingLine}</p>
          <span className="closing-hashtag">{wedding.couple.hashtag}</span>
          <span className="closing-ornament" aria-hidden="true">✦　❋　✦</span>
          <small>Made with love, for a day to remember</small>
        </footer>
      </main>

      {poppersActive && <PartyPoppers />}

      <AnimatePresence>
        {coverOpen && (
          <motion.div className="cover" role="dialog" aria-modal="true" aria-label="Palace doors. Open the wedding invitation" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.4 } }}>
            <motion.div className="cover-glow" initial={{ opacity: 1 }} animate={{ opacity: doorsOpening ? 0 : 1 }} transition={{ duration: reducedMotion ? 0 : 1.8, delay: reducedMotion ? 0 : 0.4 }} aria-hidden="true" />
            <motion.div className="palace-door palace-door-left" initial={{ rotateY: 0 }} animate={{ rotateY: doorsOpening ? -112 : 0 }} transition={{ duration: reducedMotion ? 0 : 1.7, ease: [0.65, 0, 0.25, 1] }} aria-hidden="true">
              <span className="palace-door-panel">❋</span>
            </motion.div>
            <motion.div className="palace-door palace-door-right" initial={{ rotateY: 0 }} animate={{ rotateY: doorsOpening ? 112 : 0 }} transition={{ duration: reducedMotion ? 0 : 1.7, ease: [0.65, 0, 0.25, 1] }} aria-hidden="true">
              <span className="palace-door-panel">❋</span>
            </motion.div>
            <motion.div className="cover-plaque" initial={{ opacity: 1 }} animate={{ opacity: doorsOpening ? 0 : 1 }} transition={{ duration: reducedMotion ? 0 : 0.35 }}>
              <Logo className="cover-logo" size={88} />
              <p className="cover-title">You are invited</p>
              {/* <h2 className="cover-names">{wedding.couple.displayName}</h2> */}
              <button className="button button-primary cover-button" ref={openInvitationRef} type="button" onClick={openInvitation} disabled={doorsOpening}>Open invitation <ArrowRight size={16} /></button>
              <span className="cover-tap">Step through the palace doors</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxIndex !== null && gallery[lightboxIndex] && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxIndex(null); }}>
            <button className="lightbox-close" ref={lightboxCloseRef} type="button" onClick={() => setLightboxIndex(null)} aria-label="Close gallery"><X /></button>
            <button className="lightbox-arrow lightbox-left" type="button" aria-label="Previous photograph" onClick={() => setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)}><ArrowLeft /></button>
            <motion.div
              className={`lightbox-art gallery-${gallery[lightboxIndex].color} ${gallery[lightboxIndex].src ? "has-photo" : ""}`}
              style={{ ["--ratio" as string]: `${gallery[lightboxIndex].width / gallery[lightboxIndex].height}` }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) setLightboxIndex((lightboxIndex + 1) % gallery.length);
                else if (info.offset.x > 60) setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
              }}
            >
              {gallery[lightboxIndex].src ? <AssetImage src={gallery[lightboxIndex].src!} alt={gallery[lightboxIndex].alt} fill sizes="(max-width: 760px) 82vw, 720px" /> : <span aria-hidden="true">✿</span>}
              {!gallery[lightboxIndex].src && <p>A photograph will bloom here</p>}
            </motion.div>
            <div className="lightbox-caption"><span>{gallery[lightboxIndex].alt}</span><span>{lightboxIndex + 1} / {gallery.length}</span></div>
            <button className="lightbox-arrow lightbox-right" type="button" aria-label="Next photograph" onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)}><ArrowRight /></button>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
