import { Component, OnInit } from '@angular/core';
import { DiaryEntry } from '../models/diaryEntry.model';
import { DiaryService } from '../service/diary.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SentimentService } from '../service/sentiment.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    RouterModule,
    CommonModule,
  ],
})
export class DiaryEntryComponent implements OnInit {
  diaryEntry: DiaryEntry = {
    id: '',
    userId: '',
    content: '',
    timestamp: new Date(),
  };
  isEditing = false;
  diaryEntries: DiaryEntry[] = [];

  constructor(
    private diaryService: DiaryService,
    private analysisService: SentimentService
  ) {}

  ngOnInit(): void {
    this.diaryService.diarySubject.subscribe((entries: DiaryEntry[]) => {
      this.diaryEntries = entries;
    });
    this.loadEntries();
    this.analysisService.clearEntries();
    for (let entry of this.diaryEntries) {
      this.analysisService.analyzeEntry(entry.content);
    }
  }

  loadEntries(): void {
    this.diaryService.getEntries();
  }

  onSubmit(): void {
    if (!this.diaryEntry.content.trim()) {
      alert('Please enter some text before submitting.');
      return;
    }

    if (this.isEditing) {
      this.diaryService.updateEntry(this.diaryEntry);
    } else {
      this.diaryEntry.timestamp = new Date(); // Set timestamp for new entry
      this.diaryService.addEntry(this.diaryEntry);
    }

    this.resetForm();
  }

  onCancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.diaryEntry = {
      id: '',
      userId: '',
      content: '',
      timestamp: new Date(),
    };
    this.isEditing = false;
  }

  editEntry(entry: DiaryEntry): void {
    this.diaryEntry = { ...entry }; // Populate form with entry data
    this.isEditing = true;
  }

  passText(content: string): void {
    this.diaryService.diaryContent = content;
  }
}
