import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

type TagStat = { tag: string; solved: number };
type ActivityItem = { date: string; label: string; delta: number; type: 'solved' | 'rating' };
type HeatCell = { day: string; count: number };

@Component({
  selector: 'app-stats',
  imports: [DecimalPipe],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  private _handle = signal('student_cf'); 
  handle = this._handle.asReadonly();

  private _range = signal<'7d' | '30d' | '90d'>('30d');
  range = this._range.asReadonly();

  private _stats = signal({
    rating: 1284,
    maxRating: 1342,
    solvedTotal: 217,
    solvedThisRange: 32,
    streakDays: 6,
    avgPerDay: 1.1,
    accuracy: 0.62, // 62%
    lastSync: '2026-01-12 14:10',
    level: 'Pupil', // mock
  });

  stats = this._stats.asReadonly();

  private _tags = signal<TagStat[]>([
    { tag: 'implementation', solved: 42 },
    { tag: 'greedy', solved: 31 },
    { tag: 'math', solved: 29 },
    { tag: 'dp', solved: 18 },
    { tag: 'graphs', solved: 12 },
    { tag: 'strings', solved: 16 },
    { tag: 'binary search', solved: 14 },
  ]);

  tags = this._tags.asReadonly();

  private _activity = signal<ActivityItem[]>([
    { date: '2026-01-12', label: '3 problemas resueltos', delta: 3, type: 'solved' },
    { date: '2026-01-11', label: 'Subiste de rating', delta: 18, type: 'rating' },
    { date: '2026-01-10', label: '1 problema resuelto', delta: 1, type: 'solved' },
    { date: '2026-01-09', label: '2 problemas resueltos', delta: 2, type: 'solved' },
  ]);

  activity = this._activity.asReadonly();

  private _heat = signal<HeatCell[]>(
    Array.from({ length: 28 }).map((_, i) => ({
      day: `D-${27 - i}`,
      count: [0, 0, 1, 2, 3, 4][(i * 7) % 6], // patrón simple
    }))
  );

  heat = this._heat.asReadonly();

  ratingProgress = computed(() => {
    const { rating, maxRating } = this.stats();
    if (!maxRating) return 0;
    return Math.min(100, Math.round((rating / maxRating) * 100));
  });

  topTags = computed(() =>
    [...this.tags()].sort((a, b) => b.solved - a.solved).slice(0, 5)
  );

  totalTagSolved = computed(() =>
    this.tags().reduce((acc, t) => acc + t.solved, 0)
  );

  barData = computed(() => {
    const max = Math.max(1, ...this.topTags().map(t => t.solved));
    return this.topTags().map(t => ({
      ...t,
      pct: Math.round((t.solved / max) * 100),
    }));
  });

  setRange(r: '7d' | '30d' | '90d') {
    this._range.set(r);

    const base = this.stats();
    if (r === '7d') {
      this._stats.set({ ...base, solvedThisRange: 9, avgPerDay: 1.3 });
    } else if (r === '30d') {
      this._stats.set({ ...base, solvedThisRange: 32, avgPerDay: 1.1 });
    } else {
      this._stats.set({ ...base, solvedThisRange: 71, avgPerDay: 0.9 });
    }
  }

  syncNow() {
    const base = this.stats();
    this._stats.set({ ...base, lastSync: '2026-01-12 14:22' });
  }
}
