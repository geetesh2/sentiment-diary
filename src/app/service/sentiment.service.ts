import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiaryService } from './diary.service';
import { SentimentResponse } from '../models/sentimentResponse.model';

@Injectable({
  providedIn: 'root'
})
export class SentimentService {

  constructor(private http: HttpClient,private diaryService:DiaryService) { }

  entryText: string = 'you are such a bad person';
  analysisResult:SentimentResponse | null = null;
  isLoading: boolean = false;

  sentimentResponses:SentimentResponse[] = [];

  private apiUrl =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
private apiKey = 'AIzaSyDpiDENqAMVi-na6DQUnWobaaKreksGdrc';

  analyzeEntry(textToanaylze:string): void {
    console.log(textToanaylze);
    if (!textToanaylze.trim()) {
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
                Analyze the sentiment of the following text: "${textToanaylze}". 
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
          var response:any = this.parseJsonResponse(response);
          this.sentimentResponses.push(response);
          console.log("succesful");
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
}
