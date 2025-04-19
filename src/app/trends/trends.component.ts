import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { DiaryService } from '../service/diary.service';
import { DiaryEntry } from '../models/diaryEntry.model';

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css'],
})
export class TrendsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  sentiments: number[] = [];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
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
        beginAtZero: false,
        min: -1,
        max: 1,
      },
    },
  };

  public lineChartType: ChartType = 'line';

  constructor(private diaryService: DiaryService) {}

  ngOnInit(): void {
    this.diaryService.diarySubject.subscribe((entries: DiaryEntry[]) => {
      for (let entry of entries) {
        this.sentiments.push(entry.sentimentScore);
      }
    });
    this.loadMoodTrends();
  }

  private loadMoodTrends(): void {
    const scores: number[] = this.sentiments;
    const labels: string[] = this.sentiments.map(
      (_, index) => `Entry ${index + 1}`
    );

    this.lineChartData.datasets[0].data = scores;
    this.lineChartData.labels = labels;

    this.chart?.update();
  }
}
