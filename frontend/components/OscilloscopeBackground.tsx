// A single period of an EKG-style pulse trace (baseline with two blips),
// drawn twice back-to-back so the 0..800 viewBox is seamlessly periodic —
// letting the wrapper scroll -50% in a loop with no visible seam.
const WAVE_D =
  "M0,100 H40 L50,40 L60,160 L70,100 H110 L120,70 L130,130 L140,100 H400" +
  " H440 L450,40 L460,160 L470,100 H510 L520,70 L530,130 L540,100 H800";

export default function OscilloscopeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none hero-bg-mask overflow-hidden">
      {/* graticule grid, like a scope screen */}
      <div className="absolute inset-0 oscilloscope-grid" />

      {/* sweeping beam cursor */}
      <div className="absolute inset-y-0 w-px bg-accent/40 oscilloscope-sweep" aria-hidden />

      {/* scrolling waveform trace */}
      <div className="absolute inset-0 flex items-center">
        <svg
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
          className="w-[200%] h-24 shrink-0 oscilloscope-scroll"
          aria-hidden
        >
          <path d={WAVE_D} fill="none" stroke="var(--color-accent)" strokeWidth={2} className="oscilloscope-trace" />
        </svg>
      </div>
    </div>
  );
}
