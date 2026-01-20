import { Component, computed, signal } from '@angular/core';

type TagStat = { tag: string; solved: number };
type SolveBin = { label: string; solved: number }; // ej: "800", "900", ...

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  // KPIs mock (como la imagen)
  rating = signal(1243);
  solved = signal(1243);
  streakDays = signal(6);

  // --- Rating history (mock) ---
  // puntos en el tiempo (sube suave al final)
  private _ratingSeries = signal<number[]>([
    820, 910, 860, 880, 940, 980, 900, 870, 860, 930, 1010, 1040, 1080, 1120, 1100,
  ]);

  // --- Solves by rating (mock) ---
  private _solvesByRating = signal<SolveBin[]>([
    { label: '800', solved: 300 },
    { label: '900', solved: 130 },
    { label: '1000', solved: 160 },
    { label: '1100', solved: 60 },
    { label: '1200', solved: 100 },
    { label: '1300', solved: 125 },
    { label: '1400', solved: 70 },
    { label: '1500', solved: 50 },
    { label: '1600', solved: 30 },
    { label: '1700', solved: 12 },
    { label: '1800', solved: 7 },
    { label: '1900', solved: 3 },
  ]);

  // --- Tags (mock) ---
  tags = signal<TagStat[]>([
    { tag: 'implementation', solved: 453 },
    { tag: 'binary search', solved: 420 },
    { tag: 'greedy', solved: 524 },
    { tag: 'math', solved: 32 },
    { tag: 'fft', solved: 69 },
    { tag: 'graphs', solved: 532 },
  ]);

  // ====== Rating Graph (SVG) ======
  // área “dibujable” dentro del SVG
  ratingW = 640;
  ratingH = 220;
  padding = { l: 34, r: 14, t: 14, b: 26 };

  ratingMin = computed(() => Math.min(...this._ratingSeries()));
  ratingMax = computed(() => Math.max(...this._ratingSeries()));

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
    this.ratingPoints()
      .map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ')
  );

  // ====== Solves by rating (SVG) ======
  barsW = 640;
  barsH = 300;
  barsPadding = { l: 42, r: 16, t: 16, b: 34 };

  solvesMax = computed(() => Math.max(...this._solvesByRating().map(b => b.solved)));

  bars = computed(() => {
    const data = this._solvesByRating();
    const max = this.solvesMax();
    const w = this.barsW;
    const h = this.barsH;
    const { l, r, t, b } = this.barsPadding;

    const innerW = w - l - r;
    const innerH = h - t - b;

    const barW = innerW / data.length;
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
        // color “por zona” (se parece al screenshot: grises, verdes, morados, rosado)
        fill: this.binColor(Number(d.label)),
      };
    });
  });

  yTicks = computed(() => {
    const max = this.solvesMax();
    // ticks parecidos al screenshot (0..350)
    const top = Math.ceil(max / 50) * 50;
    const ticks = [];
    for (let v = 50; v <= top; v += 50) ticks.push(v);
    return ticks;
  });

  private binColor(r: number) {
    // Ajustalo si querés otro look
    if (r <= 1100) return 'rgba(140,140,140,0.85)';   // gris
    if (r <= 1500) return 'rgba(0,220,140,0.85)';     // verde
    if (r <= 1800) return 'rgba(140,120,240,0.75)';   // morado
    return 'rgba(255,90,170,0.75)';                   // rosado
  }
}
