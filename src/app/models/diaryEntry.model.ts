export interface DiaryEntry {
    id: string;
    userId: string;
    content: string;
    timestamp: Date;
    sentimentScore?: number;
  }
  