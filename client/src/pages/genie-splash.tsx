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
  const THRESHOLD = 500; // rub distance threshold — requires sustained rubbing

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
          const next = Math.min(prev + dist * 0.18, THRESHOLD);
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

    // Phase 1: smoke intensifies + lamp glows brighter (1.5s)
    setTimeout(() => setShowWebsite(true), 1500);
    // Phase 2: "Your wish is granted" lingers for 3s
    // Phase 3: navigate to landing page
    setTimeout(() => setLocation("/home"), 5000);
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

          {/* SVG Lamp */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 sm:w-56 sm:h-56 drop-shadow-2xl"
              style={{
                filter: `drop-shadow(0 0 ${12 + lampGlow * 30}px rgba(245,158,11,${0.3 + lampGlow * 0.5})) drop-shadow(0 0 ${6 + lampGlow * 15}px rgba(124,58,237,${0.2 + lampGlow * 0.3}))`,
                transition: "filter 0.3s ease",
              }}
            >
              {/* Lamp body */}
              <ellipse cx="100" cy="150" rx="55" ry="18" fill="url(#lampBase)" />
              <path d="M55 140 C55 110, 70 90, 100 85 C130 90, 145 110, 145 140 Z" fill="url(#lampBody)" />
              <ellipse cx="100" cy="140" rx="45" ry="14" fill="url(#lampRim)" />

              {/* Lamp lid */}
              <path d="M80 90 C80 78, 88 70, 100 68 C112 70, 120 78, 120 90" fill="url(#lampLid)" />
              <ellipse cx="100" cy="90" rx="20" ry="5" fill="#9333EA" opacity="0.6" />

              {/* Lamp tip/flame */}
              <circle cx="100" cy="65" r="5" fill="#F59E0B" opacity={0.6 + lampGlow * 0.4}>
                <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values={`${0.5 + lampGlow * 0.3};${0.9 + lampGlow * 0.1};${0.5 + lampGlow * 0.3}`} dur="1.5s" repeatCount="indefinite" />
              </circle>

              {/* Spout */}
              <path d="M145 130 C155 125, 165 128, 170 120" stroke="url(#lampSpout)" strokeWidth="8" fill="none" strokeLinecap="round" />

              {/* Handle */}
              <path d="M55 120 C40 118, 35 130, 40 140 C45 148, 55 145, 55 140" stroke="#F59E0B" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />

              {/* Decorative band */}
              <rect x="70" y="118" width="60" height="4" rx="2" fill="#F59E0B" opacity="0.5" />

              {/* Gradients */}
              <defs>
                <linearGradient id="lampBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#5B21B6" />
                </linearGradient>
                <linearGradient id="lampBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6D28D9" />
                  <stop offset="100%" stopColor="#4C1D95" />
                </linearGradient>
                <linearGradient id="lampRim" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F59E0B" opacity="0.6" />
                  <stop offset="50%" stopColor="#FBBF24" opacity="0.8" />
                  <stop offset="100%" stopColor="#F59E0B" opacity="0.6" />
                </linearGradient>
                <linearGradient id="lampLid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
                <linearGradient id="lampSpout" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#F59E0B" />
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
