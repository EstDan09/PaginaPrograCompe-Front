export type TagStat = { tag: string; solved: number };
export type SolveBin = { label: string; solved: number };
export type RatingPoint = { t: string; rating: number };

export interface IStatsMeResponse {
  user: { userId: string; cfHandle: string; role: string };
  kpis: { rating: number; solvedTotal: number; streakDays: number };
  ratingGraph: { min: number; max: number; series: RatingPoint[] };
  solvesByRating: { binSize: number; bins: Array<{ from: number; to: number; label: string; solved: number }> };
  tags: TagStat[];
  meta: { generatedAt: string; source: string; cacheTtlSeconds: number };
}