import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
})
export class AnalysisComponent {
  entryText: string = '';
  analysisResult: any = null;
  isLoading: boolean = false;

  private apiUrl = 'https://api.meaningcloud.com/sentiment-2.1'; // MeaningCloud API URL
  private apiKey = 'YOUR_MEANINGCLOUD_API_KEY'; // Replace with your API key

  constructor(private http: HttpClient) {}

  analyzeEntry(): void {
    if (!this.entryText.trim()) {
      alert('Please enter some text to analyze.');
      return;
    }

    this.isLoading = true;

    const params = {
      key: this.apiKey,
      txt: this.entryText,
      lang: 'en', // Language code (English)
    };

    this.http.post(this.apiUrl, null, { params }).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.analysisResult = response;
      },
      (error) => {
        this.isLoading = false;
        alert('An error occurred while analyzing the text.');
        console.error(error);
      }
    );
  }

  reset(): void {
    this.entryText = '';
    this.analysisResult = null;
  }
}
