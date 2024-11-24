import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import {CategoryScale} from 'chart.js'; 

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [BaseChartDirective], // Import NgChartsModule
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent {
  
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        data: [70, 65, 75, 80, 60, 85, 90], // Example sentiment scores
        label: 'Mood Score',
        fill: true,
        tension: 0.5,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.3)',
      },
    ],
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  public lineChartType: ChartType = 'line';
}
