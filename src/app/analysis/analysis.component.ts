import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiaryService } from '../service/diary.service';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
})
export class AnalysisComponent implements OnInit{
  entryText: string = 'you are such a bad person';
  analysisResult: {
    sentiment?: string;
    confidence?: number;
    irony?: string;
  } | null = null;
  isLoading: boolean = false;

  private apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
  private apiKey = 'AIzaSyDpiDENqAMVi-na6DQUnWobaaKreksGdrc';

  constructor(private http: HttpClient,private diaryService:DiaryService) {}

  ngOnInit(): void {
    this.entryText = this.diaryService.diaryContent;
  }

  analyzeEntry(): void {
    if (!this.entryText.trim()) {
      alert('Please enter some text to analyze.');
      return;
    }

    this.isLoading = true;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `
                Analyze the sentiment of the following text: "${this.entryText}". 
                Respond in this JSON format:
                {
                  "sentiment": "positive | neutral | negative",
                  "confidence": "number (0-100)",
                  "irony": "ironic | not ironic"
                }
              `,
            },
          ],
        },
      ],
    };

    this.http
      .post(`${this.apiUrl}?key=${this.apiKey}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe(
        (response: any) => {
          this.isLoading = false;
          this.analysisResult = this.parseJsonResponse(response);
        },
        (error) => {
          this.isLoading = false;
          alert('An error occurred while analyzing the text.');
          console.error(error);
        }
      );
  }

  private parseJsonResponse(response: any): {
    sentiment?: string;
    confidence?: number;
    irony?: string;
  } {
    try {
      const rawText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonText = rawText.replace(/```json|```/g, '').trim(); // Remove Markdown formatting
      return JSON.parse(jsonText); // Parse the JSON string
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      return { sentiment: 'N/A', confidence: 0, irony: 'N/A' };
    }
  }

  reset(): void {
    this.entryText = '';
    this.analysisResult = null;
  }
}
