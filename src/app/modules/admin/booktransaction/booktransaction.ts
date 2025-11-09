import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  selector: 'app-book-transaction',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booktransaction.html',
  styleUrls: ['./booktransaction.scss']
})
export class Booktransaction implements OnInit {
  filterForm!: FormGroup;
  borrowRecords: BorrowRecord[] = [];
  filteredRecords: BorrowRecord[] = [];

  viewMode: 'all' | 'book' | 'student' = 'all'; // toggle mode

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      searchText: [''],
      viewFilter: ['all'] // all | book | student
    });

    // Mock transaction data
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
        bookId: 101,
        bookName: 'Clean Code',
        userId: 204,
        userName: 'David',
        borrowDate: '2025-11-01',
        returnDate: '',
        overDueDays: 3,
        fine: 30
      }
    ];

    this.filteredRecords = [...this.borrowRecords];

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const { searchText, viewFilter } = this.filterForm.value;
    this.viewMode = viewFilter;

    const text = searchText.toLowerCase();

    if (viewFilter === 'all') {
      this.filteredRecords = this.borrowRecords.filter(
        rec =>
          rec.bookName.toLowerCase().includes(text) ||
          rec.userName.toLowerCase().includes(text) ||
          rec.bookId.toString().includes(text) ||
          rec.userId.toString().includes(text)
      );
    } else if (viewFilter === 'book') {
      this.filteredRecords = this.borrowRecords.filter(
        rec =>
          rec.bookName.toLowerCase().includes(text) ||
          rec.bookId.toString().includes(text)
      );
    } else if (viewFilter === 'student') {
      this.filteredRecords = this.borrowRecords.filter(
        rec =>
          rec.userName.toLowerCase().includes(text) ||
          rec.userId.toString().includes(text)
      );
    }
  }

  resetFilters(): void {
    this.filterForm.setValue({ searchText: '', viewFilter: 'all' });
    this.filteredRecords = [...this.borrowRecords];
    this.viewMode = 'all';
  }

  // Helper: get last borrowed person for a given book
  getLastBorrower(bookId: number) {
    const bookRecords = this.borrowRecords
      .filter(r => r.bookId === bookId)
      .sort((a, b) => (a.borrowDate < b.borrowDate ? 1 : -1));
    return bookRecords.length > 0 ? bookRecords[0].userName : 'N/A';
  }
}
