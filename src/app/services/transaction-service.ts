import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransactionRecord {
  borrowId: any;
  id: number;
  bookId: string;
  bookName: string;
  userId: string;
  userName: string;
  borrowDate: string;
  returnDate: string | null;
  overDueDays: number;
  fine: number;
  paid: boolean;
  returned: boolean; 
}



@Injectable({ providedIn: 'root' })
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api/librarian/transaction'; 

  constructor(private http: HttpClient) {}


  getAllTransactions(): Observable<TransactionRecord[]> {
  return this.http.get<TransactionRecord[]>(`${this.baseUrl}`);
}

markFineAsPaid(recordId: number): Observable<void> {
  return this.http.put<void>(`${this.baseUrl}/${recordId}/mark-paid`, {});
}
returnBook(borrowRecordId: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/${borrowRecordId}/return`, {});
}


}
