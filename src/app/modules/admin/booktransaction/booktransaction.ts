import { CommonModule } from "@angular/common";
// import { HttpClientModule } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TransactionRecord, TransactionService } from "../../../services/transaction-service";

@Component({
  selector: 'app-booktransaction',
  templateUrl: './booktransaction.html',
  styleUrls: ['./booktransaction.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],// HttpClientModule],
})

export class Booktransaction implements OnInit {
 records: TransactionRecord[] = [];
  filteredRecords: TransactionRecord[] = [];
  filterForm!: FormGroup;

  constructor(private fb: FormBuilder, private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      searchText: [''],
      viewFilter: ['all']
    });

    this.loadTransactions();

    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (data: TransactionRecord[]) => {
            
        // this.records = data.sort((a, b) => b.borrowId - a.borrowId);
        this.records = data.reverse();
        this.filteredRecords = data;
        console.log('Received transaction data:', data);

      },
      error: (err: any) => console.error('Error loading transactions', err)
    });
  }

  applyFilters(): void {
    const { searchText, viewFilter } = this.filterForm.value;
    const search = (searchText || '').toLowerCase();

    this.filteredRecords = this.records.filter((record) => {
      const matchesSearch =
        record.bookName.toLowerCase().includes(search) ||
        record.userName.toLowerCase().includes(search);

      if (viewFilter === 'book') return matchesSearch && !!record.bookId;
      if (viewFilter === 'student') return matchesSearch && !!record.userId;
      return matchesSearch;
    });
  }

  resetFilters(): void {
    this.filterForm.setValue({ searchText: '', viewFilter: 'all' });
    this.filteredRecords = [...this.records];
  }



}
