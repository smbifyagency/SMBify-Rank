import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "wouter";

/* ═══════════════════════════════════════════════════════════════════════════
   SiteGenie — Animated Splash / Entry Page
   User rubs the magic lamp → genie emerges → navigates to homepage.
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
  const [showGenie, setShowGenie] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const trailId = useRef(0);
  const lampRef = useRef<HTMLDivElement>(null);
  const pointerDown = useRef(false);
  const THRESHOLD = 150;

  // Clean up old trails
  useEffect(() => {
    if (rubTrails.length > 20) {
      setRubTrails(prev => prev.slice(-15));
    }
  }, [rubTrails]);

  const handleRubMove = useCallback((clientX: number, clientY: number) => {
    if (!lampRef.current || entered || !pointerDown.current) return;

    const rect = lampRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

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

    // Phase 1: Genie emerges from lamp (0.5s delay)
    setTimeout(() => setShowGenie(true), 500);
    // Phase 2: "Your wish is granted" message (1.5s)
    setTimeout(() => setShowMessage(true), 1500);
    // Phase 3: Navigate to homepage (3.5s total)
    setTimeout(() => setLocation("/home"), 3500);
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

        {/* Title — fades up on entry */}
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
            transform: entered ? "scale(0.8) translateY(60px)" : `scale(${1 + progress * 0.1})`,
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
          {(entered || progress > 0.3) && (
            <div className="absolute inset-0 overflow-visible">
              {smokeParticles.map((p, i) => (
                <SmokeParticle key={i} {...p} />
              ))}
            </div>
          )}

          {/* Real Lamp SVG Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/magic-lamp.svg"
              alt="Magic Lamp"
              className="w-52 h-52 sm:w-64 sm:h-64"
              draggable={false}
              style={{
                filter: `drop-shadow(0 0 ${12 + lampGlow * 30}px rgba(245,158,11,${0.3 + lampGlow * 0.5})) drop-shadow(0 0 ${6 + lampGlow * 15}px rgba(124,58,237,${0.2 + lampGlow * 0.3}))`,
                transition: "filter 0.3s ease",
              }}
            />
          </div>

          {/* Rub sparkle trails */}
          {rubTrails.slice(-15).map(t => (
            <RubTrail key={t.id} x={t.x} y={t.y} />
          ))}
        </div>

        {/* Genie emerging from lamp */}
        {showGenie && (
          <div
            className="absolute animate-genie-emerge pointer-events-none"
            style={{
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <img
              src="/genie.svg"
              alt="Genie"
              className="w-40 h-40 sm:w-52 sm:h-52"
              style={{
                filter: "drop-shadow(0 0 30px rgba(124,58,237,0.6)) drop-shadow(0 0 60px rgba(245,158,11,0.3))",
              }}
            />
          </div>
        )}

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

        {/* "Your wish is granted" overlay */}
        {showMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.95) 0%, rgba(139,92,246,0.7) 30%, rgba(30,27,75,0.95) 70%)",
                animation: "magic-expand 2.5s cubic-bezier(.23,1,.32,1) forwards",
              }}
            />
            <div className="relative z-10 text-center animate-fade-scale-in">
              <img
                src="/genie.svg"
                alt="Genie"
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6"
                style={{ filter: "drop-shadow(0 0 20px rgba(192,132,252,0.5))" }}
              />
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
