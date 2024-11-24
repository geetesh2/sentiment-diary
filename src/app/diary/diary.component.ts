import { Component, OnInit } from '@angular/core';
import { DiaryEntry } from '../models/diaryEntry.model';
import { DiaryService } from '../service/diary.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
  standalone:true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class DiaryEntryComponent implements OnInit {
  diaryEntry: DiaryEntry = { id: '', userId: '', content: '', timestamp: new Date() };
  isEditing = false;

  constructor(private diaryService: DiaryService) {}

  ngOnInit(): void {
    // If editing, populate diaryEntry (e.g., from route or service)
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.diaryService.updateEntry(this.diaryEntry).subscribe(() => {
        alert('Entry updated successfully!');
        this.resetForm();
      });
    } else {
      this.diaryService.addEntry(this.diaryEntry).subscribe(() => {
        alert('Entry added successfully!');
        this.resetForm();
      });
    }
  }

  onCancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.diaryEntry = { id: '', userId: '', content: '', timestamp: new Date() };
    this.isEditing = false;
  }
}
