import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';



@Component({
  selector: 'app-bar-chart',
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
})
export class BarChart {

  public barChartType: ChartType = 'bar';

  public barChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [280, 120, 100, 130, 80, 75, 90],
        label: 'Series A',
        fill: 'origin',
      },
    ],
    labels: [800, 900, 1000, 1100, 1200, 1300, 1400],
  };

  public barChartOptions: ChartConfiguration['options'] = {
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
      annotation: {
        annotations: [
          {
            scaleID: 'x',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
          },
        ],
      },
    },
  };
}
