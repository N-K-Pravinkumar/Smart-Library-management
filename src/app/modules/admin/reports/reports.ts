import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

interface Student {
  id: number;
  username: string;
  phone: string;
  status: 'Borrowed' | 'Unborrowed';
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Import ReactiveFormsModule
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class Reports implements OnInit {
  students: Student[] = [
    { id: 105, username: 'Pravin', phone: '9876543210', status: 'Borrowed' },
    { id: 102, username: 'Ankita', phone: '8765432109', status: 'Unborrowed' },
    { id: 110, username: 'Tharun', phone: '9123456789', status: 'Borrowed' },
    { id: 101, username: 'Karthik', phone: '9988776655', status: 'Unborrowed' },
    { id: 108, username: 'Sneha', phone: '9876501234', status: 'Borrowed' },
  ];

  filteredStudents: Student[] = [];
  filterForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // ✅ Initialize Reactive Form
    this.filterForm = this.fb.group({
      searchTerm: [''],
      sortOrder: ['desc'],
      filterStatus: ['all']
    });

    // ✅ Watch for form value changes
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.applyFilters();
  }

  applyFilters(): void {
    const { searchTerm, sortOrder, filterStatus } = this.filterForm.value;
    let result = [...this.students];

    // 🔍 Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.username.toLowerCase().includes(term) ||
        s.phone.includes(term) ||
        s.id.toString().includes(term)
      );
    }

    // 📘 Borrowed/Unborrowed filter
    if (filterStatus !== 'all') {
      result = result.filter(s => s.status.toLowerCase() === filterStatus);
    }

    // 🔢 Sorting
    result.sort((a, b) =>
      sortOrder === 'asc' ? a.id - b.id : b.id - a.id
    );

    this.filteredStudents = result;
  }

  setFilter(status: 'all' | 'borrowed' | 'unborrowed'): void {
    this.filterForm.patchValue({ filterStatus: status });
  }
}
