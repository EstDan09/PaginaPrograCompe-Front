import { Component, computed, effect, input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

type RatingPoint = { t: string; rating: number };

@Component({
  selector: 'app-time-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './time-chart.html',
  styleUrls: ['./time-chart.scss'],
})
export class TimeChart {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  series = input<RatingPoint[]>([]);
  public readonly lineChartType: 'line' = 'line';

  // labels + number[] (lo más compatible)
  labels = computed(() => this.series().map(p => p.t));
  values = computed(() => this.series().map(p => p.rating));

  public lineChartData = computed<ChartConfiguration<'line'>['data']>(() => ({
    labels: this.labels(),
    datasets: [
      {
        label: 'Rating',
        data: this.values(),
        fill: true,
        tension: 0.15,
        pointRadius: 2,
      },
    ],
  }));

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: false },
    plugins: { legend: { display: true } },
    scales: {
      x: { ticks: { maxRotation: 0, autoSkip: true } },
      y: { beginAtZero: false },
    },
  };

  constructor() {
  effect(() => {
    const s = this.series();

    console.log('[TimeChart] series len:', s?.length);
    console.log('[TimeChart] first:', s?.[0]);
    console.log('[TimeChart] last:', s?.[s.length - 1]);

    const labels = this.labels();
    const values = this.values();

    console.log('[TimeChart] labels sample:', labels.slice(0, 3));
    console.log('[TimeChart] values sample:', values.slice(0, 3));
    console.log('[TimeChart] values types:', values.slice(0, 3).map(v => typeof v));

    // Si hay NaN esto te lo delata de inmediato
    console.log('[TimeChart] has NaN?', values.some(v => Number.isNaN(v)));

    queueMicrotask(() => {
      console.log('[TimeChart] chart instance?', !!this.chart?.chart);
      this.chart?.update();
    });
  });
}


}
