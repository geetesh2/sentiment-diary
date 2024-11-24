import { Injectable } from '@angular/core';
import { DiaryEntry } from '../models/diaryEntry.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  private entries: DiaryEntry[] = []; // Temporary in-memory storage

  addEntry(entry: DiaryEntry): Observable<void> {
    this.entries.push(entry);
    return of(); // Replace with Firestore logic
  }

  updateEntry(entry: DiaryEntry): Observable<void> {
    const index = this.entries.findIndex((e) => e.id === entry.id);
    if (index !== -1) this.entries[index] = entry;
    return of(); // Replace with Firestore logic
  }

  constructor() { }
}
