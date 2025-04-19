import { Injectable } from '@angular/core';
import { DiaryEntry } from '../models/diaryEntry.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SentimentService } from './sentiment.service';
import { environment } from 'src/environments/environment.development'; // Correct path to environment

@Injectable({
  providedIn: 'root',
})
export class DiaryService {
  private firebaseDbUrl = environment.firebaseDbUrl;
  diaryContent: string = '';

  diarySubject = new BehaviorSubject<DiaryEntry[]>([]);

  constructor(
    private http: HttpClient,
    private sentimentService: SentimentService
  ) {}

  private getUserId(): string | null {
    return localStorage.getItem('localId');
  }

  getEntries(): void {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User ID is not available.');
    }
    const url = `${this.firebaseDbUrl}/entries/${userId}.json`;

    this.http.get<{ [key: string]: DiaryEntry }>(url).subscribe((response) => {
      const entries = response
        ? Object.keys(response).map((key) => ({ ...response[key] }))
        : [];
      this.sentimentService.clearEntries();
      this.diarySubject.next(entries);
    });
  }

  /**
   * Add a new diary entry with sentiment analysis before saving it.
   */
  addEntry(entry: DiaryEntry): void {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User ID is not available.');
    }

    const url = `${this.firebaseDbUrl}/entries/${userId}.json`;

    // Analyze sentiment before saving the entry
    this.sentimentService.analyzeEntry(entry.content)?.subscribe((sentimentScore: any) => {
      // Add the sentiment score to the entry
      const entryWithSentiment = { ...entry, sentimentScore };

      // Save the entry to Firebase
      this.http.post<{ name: string }>(url, entryWithSentiment).subscribe((response) => {
        entryWithSentiment.id = response.name; // Firebase assigns a unique key

        // Update the local BehaviorSubject
        const currentEntries = this.diarySubject.value;
        this.diarySubject.next([...currentEntries, entryWithSentiment]);
      });
    });
  }
  
  updateEntry(entry: DiaryEntry): void {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User ID is not available.');
    }
    const url = `${this.firebaseDbUrl}/entries/${userId}/${entry.id}.json`;

    this.http.put(url, entry).subscribe(() => {
      const updatedEntries = this.diarySubject.value.map((e) =>
        e.id === entry.id ? entry : e
      );
      this.diarySubject.next(updatedEntries);
    });
  }
}
