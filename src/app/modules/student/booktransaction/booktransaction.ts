import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { BorrowService } from "../../../services/borrow-service";
import { BorrowRecord } from "../../../services/borrow-service";

@Component({
  selector: 'app-book-transaction',
  templateUrl: './booktransaction.html',
  styleUrls: ['./booktransaction.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class Booktransaction implements OnInit {
  records: BorrowRecord[] = [];
  filteredRecords: BorrowRecord[] = [];
  filterForm!: FormGroup;
  loggedInUserId!: string;

  constructor(private fb: FormBuilder, private borrowService: BorrowService) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({ searchText: [''] });

    const studentIdStr = localStorage.getItem('userId');
    if (!studentIdStr) { alert('No student logged in'); return; }
    this.loggedInUserId = studentIdStr;

    this.loadTransactions();
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

 loadTransactions(): void {
  this.borrowService.getBorrowRecords(+this.loggedInUserId).subscribe({
    next: (data) => {
      this.records = data.map(record => ({
        ...record,
        returned: record.returnDate !== null
      })).reverse();
      this.filteredRecords = [...this.records];
    },
    error: (err) => console.error('Error loading transactions', err)
  });
}


  applyFilters(): void {
  const search = (this.filterForm.value.searchText || '').toLowerCase();
  this.filteredRecords = this.records.filter(record =>
    record.book.bookId.toString().toLowerCase().includes(search) ||
    record.book.bookName.toLowerCase().includes(search)
  );
}

  resetFilters(): void {
    this.filterForm.setValue({ searchText: '' });
    this.filteredRecords = [...this.records];
  }

 markAsReturned(record: BorrowRecord): void {
  if (confirm(`Return the book "${record.book.bookName}"?`)) {
    this.borrowService.returnBook(record.borrowId).subscribe({
      next: () => {
        record.returned = true; 
        this.returnBook(record);
        alert('Book returned successfully!');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to return the book.');
      }
    });
  }
}
handleReturn(record: BorrowRecord) {
  if (record.overDueDays > 0 && record.fine > 0 && !record.pay) {
    const pay = confirm(
      `This book "${record.book.bookName}" has a fine of ₹${record.fine}. Do you want to pay and return it? "okay"`
    );
    if (!pay) return;

    this.borrowService.markFineAsPaid(record.borrowId).subscribe({
      next: () => {
        record.pay = true;  
        this.returnBook(record);
      },
      error: err => {
        console.error('Error paying fine:', err);
        alert('Failed to pay fine. Try again.');
      }
    });
  } else {
    this.returnBook(record);
  }
}

private returnBook(record: BorrowRecord) {
  if (confirm(`Return the book "${record.book.bookName}"?`)) {
    this.borrowService.returnBook(record.borrowId).subscribe({
      next: () => {

        record.returned = true;
        record.returnDate = new Date().toISOString();
        record.pay = true;  
        this.records = [...this.records];
        this.filteredRecords = [...this.filteredRecords];

        alert('Book returned successfully!');
      },
      error: err => {
        console.error('Error returning book:', err);
        alert('Failed to return the book. Try again.');
      }
    });
  }
}




}
