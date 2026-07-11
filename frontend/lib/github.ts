export type ContributionDay = { date: string; count: number; level: number };

const GITHUB_USERNAME = "KaranPatelDev";

export async function getContributions(): Promise<ContributionDay[] | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data?.contributions)) return null;
    return data.contributions as ContributionDay[];
  } catch {
    return null;
  }
}
