import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "wouter";

/* ═══════════════════════════════════════════════════════════════════════════
   SiteGenie — Animated Splash / Entry Page
   User rubs the magic lamp to enter the app.
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Sparkle particle ──────────────────────────────────────────────────────
function Sparkle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none animate-sparkle-float"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: "radial-gradient(circle, #F59E0B 0%, #F59E0B44 40%, transparent 70%)",
        animationDelay: `${delay}s`,
        filter: "blur(0.5px)",
      }}
    />
  );
}

// ─── Smoke particle ────────────────────────────────────────────────────────
function SmokeParticle({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none animate-smoke-rise"
      style={{
        left: `${x}%`,
        bottom: `${y}%`,
        width: s,
        height: s,
        background: "radial-gradient(circle, rgba(139,92,246,0.35), rgba(139,92,246,0.05) 60%, transparent 80%)",
        animationDelay: `${delay}s`,
        filter: "blur(6px)",
      }}
    />
  );
}

// ─── Rub trail particle ────────────────────────────────────────────────────
function RubTrail({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute pointer-events-none animate-rub-trail"
      style={{
        left: x - 12,
        top: y - 12,
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: "radial-gradient(circle, #F59E0B 0%, #7C3AED66 50%, transparent 80%)",
        boxShadow: "0 0 20px 6px rgba(245,158,11,0.4), 0 0 40px 12px rgba(124,58,237,0.2)",
      }}
    />
  );
}

export default function GenieSplash() {
  const [, setLocation] = useLocation();
  const [rubProgress, setRubProgress] = useState(0);
  const [isRubbing, setIsRubbing] = useState(false);
  const [rubTrails, setRubTrails] = useState<{ id: number; x: number; y: number }[]>([]);
  const [lampGlow, setLampGlow] = useState(0);
  const [entered, setEntered] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [showWebsite, setShowWebsite] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const trailId = useRef(0);
  const lampRef = useRef<HTMLDivElement>(null);
  const pointerDown = useRef(false);
  const THRESHOLD = 150; // rub distance threshold — a few swipes triggers entry

  // Clean up old trails
  useEffect(() => {
    if (rubTrails.length > 20) {
      setRubTrails(prev => prev.slice(-15));
    }
  }, [rubTrails]);

  const handleRubMove = useCallback((clientX: number, clientY: number) => {
    // MUST be pressing/clicking to rub — no accidental hover triggers
    if (!lampRef.current || entered || !pointerDown.current) return;

    const rect = lampRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Only count rubs inside lamp area
    if (x < -40 || x > rect.width + 40 || y < -40 || y > rect.height + 40) return;

    if (lastPos.current) {
      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 4) {
        setRubProgress(prev => {
          const next = Math.min(prev + dist * 0.5, THRESHOLD);
          setLampGlow(next / THRESHOLD);
          if (next >= THRESHOLD && !entered) {
            triggerEntry();
          }
          return next;
        });

        // Add sparkle trail
        trailId.current++;
        setRubTrails(prev => [...prev, { id: trailId.current, x: clientX - rect.left, y: clientY - rect.top }]);
      }
    }

    lastPos.current = { x: clientX, y: clientY };
    setIsRubbing(true);
  }, [entered]);

  const handlePointerDown = () => { pointerDown.current = true; setIsRubbing(true); lastPos.current = null; };
  const handlePointerUp = () => { pointerDown.current = false; setIsRubbing(false); lastPos.current = null; };
  const handleMouseMove = (e: React.MouseEvent) => handleRubMove(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    handleRubMove(t.clientX, t.clientY);
  };

  const triggerEntry = useCallback(() => {
    if (entered) return;
    setEntered(true);
    setShowSmoke(true);

    // Phase 1: smoke intensifies + lamp glows brighter (1s)
    setTimeout(() => setShowWebsite(true), 1000);
    // Phase 2: quick "Your wish is granted" then navigate
    setTimeout(() => setLocation("/home"), 2500);
  }, [entered, setLocation]);

  const progress = rubProgress / THRESHOLD;

  // Background sparkles
  const bgSparkles = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    size: 2 + Math.random() * 4,
  }));

  // Smoke particles
  const smokeParticles = Array.from({ length: 12 }, (_, i) => ({
    x: 40 + Math.random() * 20,
    y: 30 + Math.random() * 20,
    s: 60 + Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{
        background: `radial-gradient(ellipse at 50% 80%, rgba(124,58,237,${0.15 + lampGlow * 0.2}) 0%, #0a0118 50%, #030012 100%)`,
        transition: "background 0.5s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handleTouchMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Ambient sparkles */}
      {bgSparkles.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}

      {/* Top-left brand mark */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-3 opacity-80">
        <img src="/favicon.svg" alt="SiteGenie" className="w-8 h-8 rounded-lg" />
        <span className="text-white/60 font-semibold text-sm tracking-wide">SiteGenie</span>
      </div>

      {/* Main content container */}
      <div className="flex flex-col items-center justify-center h-full relative">

        {/* Title — fades up */}
        <div
          className="text-center mb-8 transition-all duration-[2000ms]"
          style={{
            opacity: entered ? 0 : 1,
            transform: entered ? "translateY(-60px) scale(0.8)" : "translateY(0)",
          }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-3">
            <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              Site
            </span>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Genie
            </span>
          </h1>
          <p className="text-purple-300/60 text-lg sm:text-xl font-medium tracking-wide">
            Your Wish. Your Website.
          </p>
        </div>

        {/* Lamp area — interactive */}
        <div
          ref={lampRef}
          className="relative cursor-grab active:cursor-grabbing"
          style={{
            width: 280,
            height: 280,
            transition: "transform 0.6s cubic-bezier(.23,1,.32,1)",
            transform: entered ? "scale(1.3) translateY(20px)" : `scale(${1 + progress * 0.1})`,
          }}
        >
          {/* Lamp glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(245,158,11,${lampGlow * 0.4}) 0%, rgba(124,58,237,${lampGlow * 0.2}) 40%, transparent 70%)`,
              transform: `scale(${1.4 + lampGlow * 0.6})`,
              transition: "all 0.3s ease",
              filter: `blur(${20 + lampGlow * 20}px)`,
            }}
          />

          {/* Smoke from lamp */}
          {(showSmoke || progress > 0.3) && (
            <div className="absolute inset-0 overflow-visible">
              {smokeParticles.map((p, i) => (
                <SmokeParticle key={i} {...p} />
              ))}
            </div>
          )}

          {/* SVG Lamp — realistic Aladdin-style golden lamp */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 300 260"
              className="w-52 h-52 sm:w-64 sm:h-64 drop-shadow-2xl"
              style={{
                filter: `drop-shadow(0 0 ${12 + lampGlow * 30}px rgba(245,158,11,${0.3 + lampGlow * 0.5})) drop-shadow(0 0 ${6 + lampGlow * 15}px rgba(124,58,237,${0.2 + lampGlow * 0.3}))`,
                transition: "filter 0.3s ease",
              }}
            >
              {/* Base plate */}
              <ellipse cx="148" cy="220" rx="80" ry="20" fill="url(#rBasePlate)" />
              <ellipse cx="148" cy="218" rx="72" ry="16" fill="url(#rBaseTop)" />

              {/* Lamp body — fat belly */}
              <path d="M76 195 C76 145, 100 115, 148 105 C196 115, 220 145, 220 195 Z" fill="url(#rBodyGrad)" />
              {/* Body highlight — left reflection */}
              <path d="M90 180 C92 150, 108 125, 135 115 C120 125, 100 150, 95 180 Z" fill="url(#rBodyHighlight)" opacity="0.5" />
              {/* Body rim */}
              <ellipse cx="148" cy="195" rx="72" ry="18" fill="url(#rBodyRim)" />
              <ellipse cx="148" cy="193" rx="68" ry="15" fill="url(#rBodyRimInner)" />

              {/* Neck */}
              <path d="M120 108 L118 85 C118 78, 125 72, 148 70 C171 72, 178 78, 178 85 L176 108" fill="url(#rNeckGrad)" />
              {/* Neck ring */}
              <ellipse cx="148" cy="108" rx="28" ry="6" fill="url(#rNeckRing)" />

              {/* Lid / dome */}
              <path d="M122 85 C122 65, 132 52, 148 48 C164 52, 174 65, 174 85" fill="url(#rLidGrad)" />
              <ellipse cx="148" cy="85" rx="26" ry="5" fill="#D4A017" opacity="0.4" />

              {/* Tip / finial */}
              <ellipse cx="148" cy="48" rx="6" ry="4" fill="url(#rFinial)" />
              <circle cx="148" cy="42" r="4" fill="#FBBF24" opacity={0.7 + lampGlow * 0.3}>
                <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Flame / magic glow from tip */}
              <ellipse cx="148" cy="34" rx={3 + lampGlow * 4} ry={6 + lampGlow * 8} fill="url(#rFlameGrad)" opacity={0.4 + lampGlow * 0.6}>
                <animate attributeName="ry" values={`${5 + lampGlow * 6};${8 + lampGlow * 10};${5 + lampGlow * 6}`} dur="1.5s" repeatCount="indefinite" />
              </ellipse>

              {/* Spout — long curved pouring spout */}
              <path d="M220 175 C238 168, 252 165, 262 148 C268 138, 270 130, 265 122" stroke="url(#rSpoutGrad)" strokeWidth="12" fill="none" strokeLinecap="round" />
              <path d="M220 175 C238 168, 252 165, 262 148 C268 138, 270 130, 265 122" stroke="url(#rSpoutHighlight)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.3" />
              {/* Spout opening */}
              <ellipse cx="264" cy="122" rx="5" ry="3" fill="#D4A017" />

              {/* Handle — big ornate loop */}
              <path d="M76 155 C52 150, 38 165, 40 185 C42 200, 56 210, 76 200" stroke="url(#rHandleGrad)" strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d="M76 155 C52 150, 38 165, 40 185 C42 200, 56 210, 76 200" stroke="#FBBF24" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.25" />

              {/* Decorative bands on body */}
              <ellipse cx="148" cy="145" rx="56" ry="10" fill="none" stroke="#FBBF24" strokeWidth="1.5" opacity="0.3" />
              <ellipse cx="148" cy="165" rx="64" ry="13" fill="none" stroke="#FBBF24" strokeWidth="1" opacity="0.2" />

              {/* Ornamental pattern on belly center */}
              <path d="M130 148 C135 140, 148 136, 166 140 C160 148, 148 152, 130 148 Z" fill="#FBBF24" opacity="0.15" />

              <defs>
                <linearGradient id="rBasePlate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8910A" />
                  <stop offset="100%" stopColor="#8B6508" />
                </linearGradient>
                <linearGradient id="rBaseTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8B818" />
                  <stop offset="100%" stopColor="#C8910A" />
                </linearGradient>
                <linearGradient id="rBodyGrad" x1="0.2" y1="0" x2="0.8" y2="1">
                  <stop offset="0%" stopColor="#F5C842" />
                  <stop offset="30%" stopColor="#D4A017" />
                  <stop offset="70%" stopColor="#B8860B" />
                  <stop offset="100%" stopColor="#8B6508" />
                </linearGradient>
                <linearGradient id="rBodyHighlight" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFF4C8" />
                  <stop offset="100%" stopColor="#F5C842" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="rBodyRim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                <linearGradient id="rBodyRimInner" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A017" />
                  <stop offset="100%" stopColor="#C8910A" />
                </linearGradient>
                <linearGradient id="rNeckGrad" x1="0.3" y1="0" x2="0.7" y2="1">
                  <stop offset="0%" stopColor="#F5C842" />
                  <stop offset="100%" stopColor="#C8910A" />
                </linearGradient>
                <linearGradient id="rNeckRing" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#B8860B" />
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                <linearGradient id="rLidGrad" x1="0.2" y1="0" x2="0.8" y2="1">
                  <stop offset="0%" stopColor="#F5D862" />
                  <stop offset="50%" stopColor="#D4A017" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                <linearGradient id="rFinial" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#D4A017" />
                </linearGradient>
                <radialGradient id="rFlameGrad" cx="0.5" cy="0.8" r="0.6">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="40%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="rSpoutGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4A017" />
                  <stop offset="50%" stopColor="#F5C842" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                <linearGradient id="rSpoutHighlight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFF4C8" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
                <linearGradient id="rHandleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A017" />
                  <stop offset="50%" stopColor="#F5C842" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Rub sparkle trails */}
          {rubTrails.slice(-15).map(t => (
            <RubTrail key={t.id} x={t.x} y={t.y} />
          ))}
        </div>

        {/* Rub progress indicator */}
        <div
          className="mt-8 flex flex-col items-center gap-3 transition-all duration-[2000ms]"
          style={{
            opacity: entered ? 0 : 1,
            transform: entered ? "translateY(40px)" : "translateY(0)",
          }}
        >
          {/* Progress bar */}
          <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, #7C3AED, #F59E0B)",
                boxShadow: progress > 0 ? "0 0 12px rgba(245,158,11,0.5)" : "none",
              }}
            />
          </div>

          {/* Instruction text */}
          <p className="text-purple-300/50 text-sm animate-pulse-subtle">
            {progress < 0.1
              ? "✨ Rub the lamp to make a wish..."
              : progress < 0.6
              ? "Keep rubbing..."
              : progress < 1
              ? "Almost there... ✨"
              : ""}
          </p>
        </div>

        {/* Magic explosion on entry */}
        {entered && !showWebsite && (
          <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
            <p className="text-purple-300/70 text-xl sm:text-2xl font-medium animate-pulse-subtle">
              ✨ The magic is building... ✨
            </p>
          </div>
        )}

        {showWebsite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.95) 0%, rgba(139,92,246,0.7) 30%, rgba(30,27,75,0.95) 70%)",
                animation: "magic-expand 2.5s cubic-bezier(.23,1,.32,1) forwards",
              }}
            />
            <div className="relative z-10 text-center animate-fade-scale-in">
              <div className="text-6xl sm:text-7xl mb-6">🧞</div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                ✨ Your wish is granted ✨
              </h2>
              <p className="text-purple-200/80 text-lg mb-2">Welcome to SiteGenie</p>
              <p className="text-purple-300/50 text-sm mt-4 animate-pulse-subtle">Entering the magic portal...</p>
            </div>
          </div>
        )}
      </div>

      {/* Skip button for accessibility */}
      <button
        onClick={() => setLocation("/home")}
        className="absolute bottom-8 right-8 text-white/20 hover:text-white/50 text-xs transition-colors"
      >
        Skip →
      </button>
    </div>
  );
}
