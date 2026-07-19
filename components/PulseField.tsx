export function PulseField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-signal/10 blur-[130px]" />
      {/* Radar sweep rings — the signature motif: stadium as a pulse being scanned */}
      <div className="absolute left-1/2 top-[-120px] -translate-x-1/2">
        <div className="h-[640px] w-[640px] rounded-full border border-signal/[0.06]" />
        <div className="absolute inset-[80px] rounded-full border border-signal/[0.08]" />
        <div className="absolute inset-[160px] rounded-full border border-signal/[0.1]" />
      </div>
    </div>
  );
}