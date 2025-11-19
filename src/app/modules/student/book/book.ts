import { Component, OnInit, TrackByFunction, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface BookModel {
  bookId: number;
  bookName: string;
  author: string;
  borrowed: boolean;  
  availableCopies: number;  
}

@Component({
  selector: 'book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './book.html',
  styleUrls: ['./book.scss']
})
export class Book implements OnInit {

  books: BookModel[] = [];
  filteredBooks: BookModel[] = [];
  filterForm: FormGroup;
  studentId!: number; 

  private snackBar = inject(MatSnackBar);

  trackByBookId: TrackByFunction<BookModel> = (index, book) => book.bookId;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.filterForm = this.fb.group({
      searchText: [''],
      statusFilter: ['all']
    });
  }

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      this.showToast('No student logged in!', 'error');
      return;
    }

    this.studentId = parseInt(storedId, 10);
    this.loadBooks();
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  loadBooks(): void {
    this.http.get<BookModel[]>('http://localhost:8080/api/student/book').subscribe({
      next: data => {
        this.books = data;
        this.filteredBooks = [...this.books];
      },
      error: err => this.showToast('Error loading books', 'error')
    });
  }

  applyFilters(): void {
    const { searchText, statusFilter } = this.filterForm.value;

    this.filteredBooks = this.books.filter(book => {
      const matchesSearch =
        book.bookName.toLowerCase().includes(searchText.toLowerCase()) ||
        book.author.toLowerCase().includes(searchText.toLowerCase()) ||
        book.bookId.toString().includes(searchText);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'borrowed' && book.availableCopies === 0) ||
        (statusFilter === 'available' && book.availableCopies > 0);

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters(): void {
    this.filterForm.setValue({ searchText: '', statusFilter: 'all' });
    this.filteredBooks = [...this.books];
  }

  borrowBook(book: BookModel): void {
    if (book.availableCopies <= 0) {
      this.showToast('No available copies to borrow!', 'error');
      return;
    }

    this.http.post(`http://localhost:8080/api/student/book/borrow`, null, {
      params: {
        bookId: book.bookId,
        studentId: this.studentId
      }
    }).subscribe({
      next: (res: any) => {
        this.showToast(res.message, 'success');
        book.availableCopies -= 1;

        if (book.availableCopies === 0) {
          book.borrowed = true;
        }
      },
      error: err => {
        this.showToast(err.error?.message || 'Error borrowing book', 'error');
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`toast-${type}`] 
    });
  }

}
