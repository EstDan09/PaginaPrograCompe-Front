import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-time-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './time-chart.html',
  styleUrls: ['./time-chart.scss'],
})
export class TimeChart {
  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration<'line', { x: string, y: number }[]>['data'] = {
    datasets: [
      {
        label: 'Series A',
        fill: 'origin',
        data: [
          { x: '2020-01-15', y: 534 },
          { x: '2020-06-10', y: 645 },
          { x: '2021-02-20', y: 875 },
          { x: '2021-09-01', y: 900 },
          { x: '2022-04-12', y: 1000 },
          { x: '2022-11-30', y: 953 },
          { x: '2023-07-08', y: 1203 },
        ],
      },
    ],
  };


  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    elements: {
      line: { tension: 0.3 },
    },

    scales: {
      y: { position: 'left' },
      y1: { position: 'right' },
    },

    animations: {
      x: {
        duration: 800,
        easing: 'easeOutQuart',
      },
      y: {
        duration: 800,
        easing: 'easeOutQuart',
      },
    },


    plugins: {
      legend: { display: true },

      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx) => `Value: ${ctx.parsed.y}`,
        },
      },

      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'x',
            borderColor: 'orange',
            borderWidth: 2,
          },
        ],
      },
    },
  };
}

