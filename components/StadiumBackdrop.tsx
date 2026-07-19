export function StadiumBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Real stadium photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/stadium-bg.jpg')",
        }}
      />

      {/* Subtle dark scrim just for text legibility, plus soft light wash for a premium editorial feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-pitch-950/60 via-transparent to-pitch-950/85" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.04] to-white/[0.10]" />
      <div className="absolute inset-0 bg-gradient-to-r from-pitch-950 via-transparent to-pitch-950" />

      {/* Floodlight glows */}
      <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-signal/[0.10] blur-[100px]" />
      <div className="absolute -right-20 -top-32 h-[600px] w-[600px] rounded-full bg-gold/[0.08] blur-[120px]" />

      {/* Grid overlay for the "data/ops" feel */}
      <div className="absolute inset-0 bg-grid bg-[size:44px_44px] opacity-60 [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black,transparent)]" />

      {/* Vignette at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-pitch-950 via-transparent to-transparent" />
    </div>
  );
}