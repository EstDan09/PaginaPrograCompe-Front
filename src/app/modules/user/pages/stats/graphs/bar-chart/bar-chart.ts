import { Component, computed, effect, input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

type Bin = { from: number; to: number; label: string; solved: number };

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
})
export class BarChart {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  bins = input<Bin[]>([]);
  public barChartType: ChartType = 'bar';

  public barChartData = computed<ChartConfiguration<'bar'>['data']>(() => ({
    labels: this.bins().map(b => b.label),
    datasets: [
      { label: 'Solved', data: this.bins().map(b => b.solved) },
    ],
  }));

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true } },
  };

  constructor() {
    effect(() => {
      this.barChartData();
      queueMicrotask(() => this.chart?.update());
    });
  }
}
