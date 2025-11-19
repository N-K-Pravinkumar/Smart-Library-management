import { Component, inject, OnInit, TrackByFunction } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatSnackBar } from '@angular/material/snack-bar';

interface BookModel {
  bookId?: number;
  bookName: string;
  author: string;
  category: string;
  borrowed?: boolean;
  returned?: boolean;
  totalBook?: number;   
  available?: number;   
}

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatSnackBarModule,HttpClientModule],
  templateUrl: './book.html',
  styleUrls: ['./book.scss']
})
export class Book implements OnInit {
  books: BookModel[] = [];
  filteredBooks: BookModel[] = [];

  filterForm: FormGroup;
  bookForm: FormGroup;

  add = false;
  editMode = false;
  selectedBookId?: number;

  
  private snackBar =  inject( MatSnackBar);

  trackByBookId: TrackByFunction<BookModel> = (index, book) => book.bookId ?? index;

  private apiBase = 'http://localhost:8080/api/librarian/book';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.filterForm = this.fb.group({
      searchText: [''],
      statusFilter: ['all']
    });

    this.bookForm = this.fb.group({
      bookName: [''],
      author: [''],
      category: [''],
      totalBook: [],  
      available: [],   
      borrowed: [false],
      returned: [true]
    });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  loadBooks(): void {
    this.http.get<any[]>(this.apiBase).subscribe({
      next: data => {
        this.books = data.map(b => {
          const total = b.totalCopies ?? b.copies ?? b.totalBook ?? b.total ?? 1;
          const avail = b.availableCopies ?? b.available ?? b.availableCount ?? b.availableBook ?? total;
          return {
            ...b,
            borrowed: !!b.borrowed,
            returned: !!b.returned,
            totalBook: Number(total),
            available: Number(avail)
          } as BookModel;
        });
        this.filteredBooks = [...this.books];
      },
      error: err => console.error('Error loading books:', err)
    });
  }

  applyFilters(): void {
    const { searchText, statusFilter } = this.filterForm.value;
    const q = (searchText || '').toString().toLowerCase();

    this.filteredBooks = this.books.filter(book => {
      const matchesSearch =
        (book.bookName || '').toLowerCase().includes(q) ||
        (book.author || '').toLowerCase().includes(q) ||
        (book.bookId?.toString().includes(q) ?? false);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'borrowed' && (book.borrowed ?? (book.available === 0))) ||
        (statusFilter === 'available' && !(book.borrowed ?? (book.available === 0)));

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters(): void {
    this.filterForm.setValue({ searchText: '', statusFilter: 'all' });
    this.filteredBooks = [...this.books];
  }

  addOrUpdateBook(): void {
    const raw = this.bookForm.value;

    const totalNum = Number(raw.totalBook || 1);
    let availableNum = Number(raw.available ?? totalNum);
    if (availableNum > totalNum) availableNum = totalNum;
    const payload = {
      bookName: raw.bookName,
      author: raw.author,
      category: raw.category,
      totalCopies: totalNum,   
      availableCopies: availableNum,
      borrowed: raw.borrowed,
      returned: raw.returned
    };

    if (this.editMode && this.selectedBookId) {
      this.http.patch(`${this.apiBase}/${this.selectedBookId}`, payload).subscribe({
        next: () => {
          this.showToast('Book updated successfully!');
          this.editMode = false;
          this.selectedBookId = undefined;
          this.bookForm.reset();
          // reset defaults after reset
          this.bookForm.patchValue({ totalBook: 1, available: 1, borrowed: false, returned: true });
          this.loadBooks();
        },
        error: err => {
          console.error(err);
        this.showToast('Failed to update book.');
        }
      });
    } else {
      this.http.post(this.apiBase, payload).subscribe({
        next: () => {
          this.showToast('Book added successfully!');
          this.add = false;
          this.bookForm.reset();
          this.bookForm.patchValue({ totalBook: 1, available: 1, borrowed: false, returned: true });
          this.loadBooks();
        },
        error: err => {
          console.error(err);
          this.showToast('Failed to add book.');
        }
      });
    }
  }

  openForm() {
    this.add = true;
    this.editMode = false;
    // ensure form defaults
    this.bookForm.patchValue({ totalBook: 1, available: 1, borrowed: false, returned: true });
  }

  closeForm() {
    this.add = false;
    this.editMode = false;
    this.bookForm.reset();
    this.bookForm.patchValue({ totalBook: 1, available: 1, borrowed: false, returned: true });
  }

  editBook(book: BookModel): void {
    this.editMode = true;
    this.selectedBookId = book.bookId;
    this.add = true; // show modal
    this.bookForm.setValue({
      bookName: book.bookName ?? '',
      author: book.author ?? '',
      category: book.category ?? '',
      totalBook: book.totalBook ?? 1,
      available: book.available ?? (book.totalBook ?? 1),
      borrowed: !!book.borrowed,
      returned: !!book.returned
    });
  }

  deleteBook(bookId: number): void {
    if (!confirm('Are you sure you want to delete this book?')) return;

    this.http.delete(`${this.apiBase}/${bookId}`).subscribe({
      next: () => {
        this.showToast('Book deleted successfully!');
        this.loadBooks();
      },
      error: err => {
        console.error(err);
        this.showToast('Failed to delete book.');
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
