import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService, StudentHomeSummary } from '../../../services/dashboard-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  totalBooks = 0;
  totalBorrowed = 0;
  booksToReturn = 0;
  totalFine = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const studentId = Number(localStorage.getItem('userId'));
    if (!studentId) {
      alert('No student logged in!');
      return;
    }

    this.dashboardService.getStudentSummary(studentId).subscribe({
      next: (summary) => {
      this.totalBooks = summary.totalBooks;
      this.totalBorrowed = summary.totalBorrowedCount;
      this.booksToReturn = summary.currentlyBorrowedCount;
      this.totalFine = summary.totalFine;
      },
      error: (err) => {
        console.error('Error fetching student dashboard:', err);
      }
    });
  }
}
