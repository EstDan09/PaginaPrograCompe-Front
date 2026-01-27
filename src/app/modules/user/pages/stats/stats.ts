import { Component, computed, signal, effect, inject } from '@angular/core';
import { StatsService } from '../../../../services/stats.service';
import { TimeChart } from './graphs/time-chart/time-chart';
import { BarChart } from './graphs/bar-chart/bar-chart';
import { AuthService } from '../../../../services/auth.service';

type TagStat = { tag: string; solved: number };
type SolveBin = { label: string; solved: number }; // ej: "800", "900", ...

@Component({
  selector: 'app-stats',
  imports: [TimeChart, BarChart],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  private _statsService = inject(StatsService);
  private _authService = inject(AuthService);

  userId = this._authService.userId;

  // Fuente única de verdad (cuando exista endpoint real, solo cambiás getMeDemo -> getMe)
  data = this._statsService.stats;

  // KPIs (fallback 0 por si aún no cargó)
  rating = computed(() => this.data()?.kpis.rating ?? 0);
  solved = computed(() => this.data()?.kpis.solvedTotal ?? 0);
  streakDays = computed(() => this.data()?.kpis.streakDays ?? 0);

  // Series para tus gráficos (manteniendo tu lógica actual)
  private _ratingSeries = computed<number[]>(() =>
    (this.data()?.ratingGraph.series ?? []).map(p => p.rating)
  );

  private _solvesByRating = computed<SolveBin[]>(() =>
    (this.data()?.solvesByRating.bins ?? []).map(b => ({ label: b.label, solved: b.solved }))
  );

  tags = computed<TagStat[]>(() => this.data()?.tags ?? []);

  // ====== Rating Graph (SVG) ======
  ratingW = 640;
  ratingH = 220;
  padding = { l: 34, r: 14, t: 14, b: 26 };

  ratingMin = computed(() => {
    const arr = this._ratingSeries();
    return arr.length ? Math.min(...arr) : 0;
  });

  ratingMax = computed(() => {
    const arr = this._ratingSeries();
    return arr.length ? Math.max(...arr) : 1;
  });

  ratingPoints = computed(() => {
    const data = this._ratingSeries();
    const min = this.ratingMin();
    const max = this.ratingMax();
    const w = this.ratingW;
    const h = this.ratingH;
    const { l, r, t, b } = this.padding;

    const innerW = w - l - r;
    const innerH = h - t - b;
    const denom = Math.max(1, max - min);

    return data.map((v, i) => {
      const x = l + (innerW * i) / Math.max(1, data.length - 1);
      const y = t + innerH * (1 - (v - min) / denom);
      return { x, y, v };
    });
  });

  ratingPolyline = computed(() =>
    this.ratingPoints().map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  );

  // ====== Solves by rating (SVG) ======
  barsW = 640;
  barsH = 300;
  barsPadding = { l: 42, r: 16, t: 16, b: 34 };

  solvesMax = computed(() => {
    const bins = this._solvesByRating();
    return bins.length ? Math.max(...bins.map(b => b.solved)) : 1;
  });

  bars = computed(() => {
    const data = this._solvesByRating();
    const max = this.solvesMax();
    const w = this.barsW;
    const h = this.barsH;
    const { l, r, t, b } = this.barsPadding;

    const innerW = w - l - r;
    const innerH = h - t - b;

    const barW = innerW / Math.max(1, data.length);
    const gap = Math.min(8, barW * 0.18);
    const realW = barW - gap;

    return data.map((d, i) => {
      const x = l + i * barW + gap / 2;
      const hh = (d.solved / Math.max(1, max)) * innerH;
      const y = t + (innerH - hh);

      return {
        ...d,
        x,
        y,
        w: realW,
        h: hh,
        fill: this.binColor(Number(d.label)),
      };
    });
  });

  yTicks = computed(() => {
    const max = this.solvesMax();
    const top = Math.ceil(max / 50) * 50;
    const ticks: number[] = [];
    for (let v = 50; v <= top; v += 50) ticks.push(v);
    return ticks;
  });

  private binColor(r: number) {
    if (r <= 1100) return 'rgba(140,140,140,0.85)';
    if (r <= 1500) return 'rgba(0,220,140,0.85)';
    if (r <= 1800) return 'rgba(140,120,240,0.75)';
    return 'rgba(255,90,170,0.75)';
  }

  constructor() {
    effect(() => {
      const id = this.userId(); // 👈 importante: llamar como función (signal)
      if (!id || id === 'none') {
        // si aún no se cargó el usuario, no pegues al backend
        // opcional: solo para dev
        this._statsService.getStudentStatsDemo().subscribe();
        return;
      }

      // ✅ endpoint real
      this._statsService.getStudentStats(id, 'all').subscribe();
    });
  }
}
