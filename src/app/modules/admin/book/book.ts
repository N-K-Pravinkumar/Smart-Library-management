import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface BookModel {
  bookId?: number;
  bookName: string;
  author: string;
  category: string;
  borrowed?: boolean;
}

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book.html',
  styleUrls: ['./book.scss']
})
export class Book implements OnInit {
  books: BookModel[] = [];
  filteredBooks: BookModel[] = [];
  filterForm: FormGroup;
  bookForm: FormGroup;
  editMode: boolean = false;
  selectedBookId?: number;

  trackByBookId: TrackByFunction<BookModel> = (index, book) => book.bookId ?? index;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.filterForm = this.fb.group({
      searchText: [''],
      statusFilter: ['all']
    });

    this.bookForm = this.fb.group({
      bookName: [''],
      author: [''],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  loadBooks(): void {
    this.http.get<BookModel[]>('http://localhost:8080/api/librarian/book').subscribe({
      next: data => {
        this.books = data.map(b => ({ ...b, borrowed: !!b.borrowed }));
        this.filteredBooks = [...this.books];
      },
      error: err => console.error('Error loading books:', err)
    });
  }

  applyFilters(): void {
    const { searchText, statusFilter } = this.filterForm.value;
    this.filteredBooks = this.books.filter(book => {
      const matchesSearch =
        book.bookName.toLowerCase().includes(searchText.toLowerCase()) ||
        book.author.toLowerCase().includes(searchText.toLowerCase()) ||
        (book.bookId?.toString().includes(searchText) ?? false);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'borrowed' && book.borrowed) ||
        (statusFilter === 'available' && !book.borrowed);

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters(): void {
    this.filterForm.setValue({ searchText: '', statusFilter: 'all' });
    this.filteredBooks = [...this.books];
  }

  addOrUpdateBook(): void {
    const bookData = this.bookForm.value;

    if (this.editMode && this.selectedBookId) {
      this.http.put(`http://localhost:8080/api/librarian/book/${this.selectedBookId}`, bookData)
        .subscribe({
          next: () => {
            alert('Book updated successfully!');
            this.editMode = false;
            this.selectedBookId = undefined;
            this.bookForm.reset();
            this.loadBooks();
          },
          error: err => alert('Failed to update book.')
        });
    } else {
      this.http.post('http://localhost:8080/api/librarian/book', bookData)
        .subscribe({
          next: () => {
            alert('Book added successfully!');
            this.bookForm.reset();
            this.loadBooks();
          },
          error: err => alert('Failed to add book.')
        });
    }
  }

  editBook(book: BookModel): void {
    this.editMode = true;
    this.selectedBookId = book.bookId;
    this.bookForm.patchValue({
      bookName: book.bookName,
      author: book.author,
      category: book.category
    });
  }

  deleteBook(bookId: number): void {
    if (!confirm('Are you sure you want to delete this book?')) return;

    this.http.delete(`http://localhost:8080/api/librarian/book/${bookId}`).subscribe({
      next: () => {
        alert('Book deleted successfully!');
        this.loadBooks();
      },
      error: err => alert('Failed to delete book.')
    });
  }
}
