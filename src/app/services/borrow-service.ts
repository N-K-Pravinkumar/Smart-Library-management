import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

export interface BorrowRecord {
  borrowId: number;
  book: {
    bookId: number;
    bookName: string;
    author: string;
    category: string;
    borrowed: boolean;
    returned: boolean;
  };
  user: {
    userId: number;
    userName: string;
    phoneNumber: number;
    role: string;
    email: string;
    password?: string;
  };
  borrowDate: string;
  returnDate?: string | null;
  overDueDays: number;
  fine: number;
  pay: boolean;       
  paid?: boolean;     
  returned?: boolean; 
}

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  private baseUrl = 'http://localhost:8080/api/student'; 

  constructor(private http: HttpClient) {}

  getBorrowRecords(studentId: number): Observable<BorrowRecord[]> {
    return this.http.get<BorrowRecord[]>(`${this.baseUrl}/transaction/${studentId}`);
  }

  
  returnBook(borrowId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/transaction/${borrowId}/return`, {});
  }

  markFineAsPaid(borrowId: number) {
  return this.http.put(`${this.baseUrl}/transaction/${borrowId}/pay`, {});
}

}
