import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSummary } from '../../../services/dashboard-service';
 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  homeSummary={
  totalBooks : 0,
  totalMembers : 0,
  totalBorrowed : 0,
  totalReturned : 0,
  totalNotReturned : 0,
  totalFine : 0
  };
 
  constructor(private http: HttpClient) {}
 
  ngOnInit(): void {
    this.fetchDashboardSummary();
  }
 
  fetchDashboardSummary(): void {
    this.http.get<DashboardSummary>('http://localhost:8080/api/librarian/home')
      .subscribe({
        next: (data) => {
          this.homeSummary={
          totalBooks : data.totalBooks,
          totalMembers : data.totalMembers,
          totalBorrowed : data.totalBorrowed,
          totalReturned : data.totalReturned,
          totalNotReturned : data.totalNotReturned,
          totalFine : data.totalFine
          };
        },
        error: (err) => console.error('Error fetching dashboard summary:', err)
      });
  }
}
 