import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface BorrowRecord {
  borrowId: number;
  bookId: number;
  bookName: string;
  userId: number;
  userName: string;
  borrowDate: string;
  returnDate?: string;
  overDueDays: number;
  fine: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  borrowRecords: BorrowRecord[] = [];

  totalBooks = 0;
  totalMembers = 0;
  totalBorrowed = 0;
  totalReturned = 0;
  totalNotReturned = 0;
  totalFine = 0;

  ngOnInit(): void {
    // Mock data — simulate backend DB fetch
    this.borrowRecords = [
      {
        borrowId: 1,
        bookId: 101,
        bookName: 'Clean Code',
        userId: 201,
        userName: 'Alice',
        borrowDate: '2025-10-20',
        returnDate: '2025-10-27',
        overDueDays: 0,
        fine: 0
      },
      {
        borrowId: 2,
        bookId: 102,
        bookName: 'Design Patterns',
        userId: 202,
        userName: 'Bob',
        borrowDate: '2025-10-10',
        returnDate: '',
        overDueDays: 5,
        fine: 50
      },
      {
        borrowId: 3,
        bookId: 103,
        bookName: 'Data Structures in Java',
        userId: 203,
        userName: 'Charlie',
        borrowDate: '2025-10-15',
        returnDate: '2025-10-25',
        overDueDays: 0,
        fine: 0
      },
      {
        borrowId: 4,
        bookId: 104,
        bookName: 'Java Concurrency in Practice',
        userId: 204,
        userName: 'David',
        borrowDate: '2025-11-01',
        returnDate: '',
        overDueDays: 3,
        fine: 30
      },
      {
        borrowId: 5,
        bookId: 101,
        bookName: 'Clean Code',
        userId: 205,
        userName: 'Eve',
        borrowDate: '2025-11-03',
        returnDate: '',
        overDueDays: 2,
        fine: 20
      }
    ];

    this.calculateSummary();
  }

  // ✅ Calculate dynamic summary for dashboard
  calculateSummary(): void {
    const uniqueBooks = new Set(this.borrowRecords.map(r => r.bookId));
    const uniqueMembers = new Set(this.borrowRecords.map(r => r.userId));

    this.totalBooks = uniqueBooks.size;
    this.totalMembers = uniqueMembers.size;
    this.totalBorrowed = this.borrowRecords.filter(r => !r.returnDate).length;
    this.totalReturned = this.borrowRecords.filter(r => !!r.returnDate).length;
    this.totalNotReturned = this.totalBorrowed;
    this.totalFine = this.borrowRecords.reduce((sum, r) => sum + r.fine, 0);
  }
}
