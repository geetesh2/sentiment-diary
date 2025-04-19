import { Injectable } from '@angular/core';
import { SentimentResponse } from '../models/sentimentResponse.model';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.development'; // Import environment variables
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SentimentService {
  private apiUrl = environment.sentimentApiUrl; // Use the URL from environment
  private apiKey = environment.sentimentApiKey; // Use the API key from environment

  sentimentResponses: SentimentResponse[] = [];
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  /**
   * Analyze the sentiment of the given text and return a sentiment score.
   * @param textToAnalyze Text to be analyzed.
   * @returns An Observable that emits the sentiment score (number).
   */
  analyzeEntry(textToAnalyze: string): Observable<number> {
    if (!textToAnalyze.trim()) {
      alert('Please enter some text to analyze.');
      return of(0);
    }

    this.isLoading = true;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `
                  Analyze the sentiment of the following text: "${textToAnalyze}". 
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

    return this.http
      .post(`${this.apiUrl}?key=${this.apiKey}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((response: any) => {
          this.isLoading = false;

          // Parse the response into JSON
          const parsedResponse = this.parseJsonResponse(response);

          // Save the response for reference
          this.sentimentResponses.push(parsedResponse);

          // Calculate and return the sentiment score
          return this.getSentimentScore(parsedResponse);
        }),
        catchError((error) => {
          this.isLoading = false;

          // Log the error
          console.error('Error analyzing sentiment:', error);

          // Alert the user about the error
          alert('An error occurred while analyzing the text.');

          // Return a neutral score in case of an error
          return of(0);
        })
      );
  }

  /**
   * Clear all saved sentiment responses.
   */
  clearEntries() {
    this.sentimentResponses = [];
  }

  /**
   * Parse the JSON response from the API.
   * @param response The raw API response.
   * @returns A parsed SentimentResponse object.
   */
  private parseJsonResponse(response: any): SentimentResponse {
    try {
      const rawText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonText = rawText.replace(/```json|```/g, '').trim(); // Remove Markdown formatting
      const parsed = JSON.parse(jsonText);

      // Ensure all properties have default values
      return {
        sentiment: parsed.sentiment || 'neutral',
        confidence: parsed.confidence || 0,
        irony: parsed.irony || 'not ironic',
      };
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      // Return default values in case of an error
      return {
        sentiment: 'neutral',
        confidence: 0,
        irony: 'not ironic',
      };
    }
  }

  /**
   * Calculate a sentiment score based on the parsed sentiment response.
   * @param sentiment The parsed sentiment response.
   * @returns A numerical sentiment score.
   */
  private getSentimentScore(sentiment: SentimentResponse): number {
    // Base score mapping for sentiment
    const sentimentScores: { [key in SentimentResponse['sentiment']]: number } =
      {
        positive: 1,
        neutral: 0,
        negative: -1,
      };

    // Default base score for unknown sentiment
    const baseScore =
      sentimentScores[sentiment.sentiment as keyof typeof sentimentScores] || 0;

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
