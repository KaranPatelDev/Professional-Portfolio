import type { ContributionDay } from "@/lib/github";

const LEVEL_OPACITY = [0.12, 0.35, 0.55, 0.75, 1];

function buildWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  if (days.length === 0) return [];
  const firstDow = new Date(days[0].date).getDay(); // 0=Sun..6=Sat
  const padded: (ContributionDay | null)[] = [...Array(firstDow).fill(null), ...days];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

export default function ContributionGraphBackground({ contributions }: { contributions: ContributionDay[] }) {
  const weeks = buildWeeks(contributions);
  let cellIndex = 0;

  return (
    <div className="absolute inset-0 pointer-events-none contribution-grid-mask overflow-hidden">
      <div className="flex gap-[3px] absolute inset-0 items-center justify-center p-6">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => {
              const idx = cellIndex++;
              if (!day) return <div key={di} className="w-[10px] h-[10px]" />;
              const active = day.count > 0;
              return (
                <div
                  key={di}
                  className={active ? "contribution-cell w-[10px] h-[10px] rounded-[2px] bg-accent" : "w-[10px] h-[10px] rounded-[2px] bg-border"}
                  style={{
                    opacity: active ? LEVEL_OPACITY[Math.min(day.level, 4)] : 0.4,
                    animationDelay: active ? `${(idx % 40) * 0.08}s` : undefined,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
