import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface BookModel {
  bookId: number;
  bookname: string;
  author: string;
  isBorrowed: boolean;
  studentId?: number | null; // ✅ Added optional studentId
}

@Component({
  selector: 'book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book.html',
  styleUrls: ['./book.scss']
})
export class Book implements OnInit {
  books: BookModel[] = [];
  filteredBooks: BookModel[] = [];
  filterForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.books = [
      { bookId: 101, bookname: 'Introduction to Algorithms', author: 'Cormen', isBorrowed: true, studentId: 201 },
      { bookId: 102, bookname: 'Clean Code', author: 'Robert C. Martin', isBorrowed: false, studentId: null },
      { bookId: 103, bookname: 'Design Patterns', author: 'Erich Gamma', isBorrowed: true, studentId: 205 },
      { bookId: 104, bookname: 'Effective Java', author: 'Joshua Bloch', isBorrowed: false, studentId: null },
      { bookId: 105, bookname: 'You Don’t Know JS', author: 'Kyle Simpson', isBorrowed: false, studentId: null }
    ];
  
    this.filterForm = this.fb.group({
      searchText: [''],
      statusFilter: ['all']
    });

    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    this.applyFilters();
  }

  applyFilters(): void {
    const { searchText, statusFilter } = this.filterForm.value;

    this.filteredBooks = this.books.filter(book => {
      const matchesSearch =
        book.bookname.toLowerCase().includes(searchText.toLowerCase()) ||
        book.author.toLowerCase().includes(searchText.toLowerCase()) ||
        book.bookId.toString().includes(searchText);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'borrowed' && book.isBorrowed) ||
        (statusFilter === 'available' && !book.isBorrowed);

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters(): void {
    this.filterForm.setValue({ searchText: '', statusFilter: 'all' });
  }
}
