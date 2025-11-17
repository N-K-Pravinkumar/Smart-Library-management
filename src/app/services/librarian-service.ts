import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BorrowRecord {
  book: any;
  borrowId: number;
  bookId: number;
  bookName: string;
  userId: number;
  userName: string;
  borrowDate: string;
  returnDate?: string;
  overDueDays: number;
  fine: number;
  paid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LibrarianService {
  private apiUrl = 'http://localhost:8080/librarian';

  constructor(private http: HttpClient) {}

  getBorrowRecords(studentId?: number): Observable<BorrowRecord[]> {
    const url = studentId 
      ? `${this.apiUrl}/transation?studentId=${studentId}` 
      : `${this.apiUrl}/transation`;
    return this.http.get<BorrowRecord[]>(url);
  }

  markAsPaid(recordId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/markPaid/${recordId}`, {});
  }
}
