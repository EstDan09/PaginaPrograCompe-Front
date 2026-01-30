import { Component, computed, effect, input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

type Solves = { tag: string, solved: number };


@Component({
  selector: 'app-donut-chart',
  imports: [BaseChartDirective],
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.scss',
})
export class DonutChart {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  data = input<Solves[]>([]);

  public readonly donutChartType: 'doughnut' = 'doughnut';

  categories = computed(() => this.data().map(p => p.tag));
  counts = computed(() => this.data().map(p => p.solved));

  public donutChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
    labels: this.categories(),
    datasets: [
      {
        label: 'Rating',
        data: this.counts(),
        fill: true,
        tension: 0.15,
        pointRadius: 2,
      },
    ],
  }));

  public donutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: false },
    plugins: { legend: { display: true } },
  };

  constructor() {
    effect(() => {
      const s = this.data();

      console.log('[TimeChart] series len:', s?.length);
      console.log('[TimeChart] first:', s?.[0]);
      console.log('[TimeChart] last:', s?.[s.length - 1]);

      const labels = this.categories();
      const values = this.counts();

      console.log('[DonutChart] labels sample:', labels.slice(0, 3));
      console.log('[DonutChart] values sample:', values.slice(0, 3));
      console.log('[DonutChart] values types:', values.slice(0, 3).map(v => typeof v));

      // Si hay NaN esto te lo delata de inmediato
      console.log('[DonutChart] has NaN?', values.some(v => Number.isNaN(v)));

      queueMicrotask(() => {
        console.log('[DonutChart] chart instance?', !!this.chart?.chart);
        this.chart?.update();
      });
    });
  }







}
