import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BorrowingReportService } from '../../../services/borrowing-report-service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class Reports implements OnInit {
  filterForm!: FormGroup;
  records: any[] = [];
  filteredRecords: any[] = [];
  totalFine: number = 0;
  studentId!: number;

  constructor(
    private fb: FormBuilder,
    private reportService: BorrowingReportService
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      alert('No student logged in. Please login first.');
      return;
    }
    this.studentId = parseInt(storedId, 10);

    this.filterForm = this.fb.group({
      searchType: ['bookId'],
      searchTerm: [''],
      filterStatus: ['all']
    });

    this.loadRecords();
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  loadRecords() {
    this.reportService.getBorrowingRecords().subscribe({
      next: (data: any[]) => {
        this.records = data.filter(r => r.studentId === this.studentId);
        this.filteredRecords = [...this.records];
        this.calculateTotalFine();
        console.log(' Received transaction data:', this.records);
      },
      error: (err: any) => console.error('Error fetching records:', err)
    });
  }

  setFilter(status: string) {
    this.filterForm.patchValue({ filterStatus: status });
  }

  applyFilters() {
    const { searchType, searchTerm, filterStatus } = this.filterForm.value;
    const term = (searchTerm || '').toLowerCase();

    this.filteredRecords = this.records.filter(record => {
      let matchesSearch = true;
      if (term) {
        if (searchType === 'bookId') {
          matchesSearch =
            record.bookId?.toString().toLowerCase().includes(term) ||
            record.bookName?.toLowerCase().includes(term);
        } else if (searchType === 'studentId') {
          matchesSearch =
            record.studentId?.toString().toLowerCase().includes(term) ||
            record.studentName?.toLowerCase().includes(term);
        }
      }

      let matchesStatus = true;
      if (filterStatus === 'borrowed') {
        matchesStatus = !record.returned;
      } else if (filterStatus === 'returned') {
        matchesStatus = record.returned;
      }

      return matchesSearch && matchesStatus;
    });

    this.calculateTotalFine();
  }

  calculateTotalFine() {
    this.totalFine = this.filteredRecords.reduce((sum, r) => sum + (r.fine || 0), 0);
  }

  downloadPDF() {
    const element = document.getElementById('reportTable');
    if (!element) return;

    import('html2canvas').then(html2canvas => {
      import('jspdf').then(jsPDF => {
        html2canvas.default(element).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
          const imgWidth = 190;
          const pageHeight = 295;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 10;

          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save('Borrowing_Report.pdf');
        });
      });
    });
  }
}
