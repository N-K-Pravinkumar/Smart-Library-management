import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Librarian dashboard summary
export interface DashboardSummary {
  totalBooks: number;
  totalMembers: number;
  totalBorrowed: number;
  totalReturned: number;
  totalNotReturned: number;
  totalFine: number;
}
export interface StudentDashboard {
  totalBooks: number;
  borrowedBooksCount: number;
  notReturnedCount: number;
  totalFine: number;
  currentBorrowedBooks: any[]; 
}





export interface StudentHomeSummary {
  totalBooks: number;            
  totalBorrowedCount: number;     
  currentlyBorrowedCount: number; 
  totalFine: number;             
}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:8080/api'; 
  constructor(private http: HttpClient) {}

  getLibrarianDashboard(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/librarian/home`);
  }
   getStudentSummary(studentId: number): Observable<StudentHomeSummary> {
  return this.http.get<StudentHomeSummary>(`${this.baseUrl}/student/home/${studentId}`);
}
getStudentHome(): Observable<StudentHomeSummary> {
  return this.http.get<StudentHomeSummary>(`${this.baseUrl}/student/home`);
}

  
  
}
