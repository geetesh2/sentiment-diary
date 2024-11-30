import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DiaryService } from '../service/diary.service';
import { SentimentService } from '../service/sentiment.service';
import { SentimentResponse } from '../models/sentimentResponse.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css'],
})
export class TrendsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [], // Sentiment scores
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
        min: -1, // Reflects normalized sentiment range
        max: 1,
      },
    },
  };

  public lineChartType: ChartType = 'line';

  constructor(private sentimentService: SentimentService) {}

  ngOnInit(): void {
    this.loadMoodTrends();
  }

  private loadMoodTrends(): void {
    // Retrieve the sentiment responses from the service
    const sentiments: SentimentResponse[] = this.sentimentService.sentimentResponses;
    console.log('Sentiments:', sentiments);

    if (!sentiments || sentiments.length === 0) {
      console.warn('No sentiments available to generate the chart.');
      return;
    }

    // Generate scores and labels
    const scores: number[] = sentiments.map((sentiment) => this.getSentimentScore(sentiment));
    const labels: string[] = sentiments.map((_, index) => `Entry ${index + 1}`);

    // Update the chart data
    this.lineChartData.datasets[0].data = scores;
    this.lineChartData.labels = labels;

    // Trigger chart update
    this.chart?.update();
    console.log('Chart Data:', this.lineChartData);
  }

  private getSentimentScore(sentiment: SentimentResponse): number {
    // Base score mapping for sentiment
    const sentimentScores: { [key in SentimentResponse['sentiment']]: number } = {
      positive: 1,
      neutral: 0,
      negative: -1,
    };

    // Default base score for unknown sentiment
    const baseScore = sentimentScores[sentiment.sentiment as keyof typeof sentimentScores] || 0;

    // Normalize confidence (0-1 scale)
    let confidenceWeight = (sentiment.confidence || 0) / 100;

    // Adjust score for irony
    if (sentiment.irony === 'ironic') {
      confidenceWeight *= 0.5; // Reduce confidence weight for ironic sentiments
    }

    // Calculate final score
    const finalScore = baseScore * confidenceWeight;

    return finalScore;
  }
}
