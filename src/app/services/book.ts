import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookModel {
  bookId: number;
  bookName: string;
  author: string;
  category: string;
  borrowed: boolean;
  returned: boolean;
  borrowedByStudentId?: number | null;
  borrowId?: number;
  totalQuantity: number;
  availableQuantity: number;
}
export interface BookModel {
  bookId: number;
  bookName: string;
  author: string;
  borrowed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private studentBaseUrl = 'http://localhost:8080/api/student/book';
  private librarianBaseUrl = 'http://localhost:8080/api/librarian/book';
  refreshSubject: any;
  baseUrl: any;

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<BookModel[]> {
    return this.http.get<BookModel[]>(`${this.baseUrl}/all`);
  }

  borrowBook(studentId: number, bookId: number): Observable<any> {
    const params = new HttpParams()
      .set('studentId', studentId)
      .set('bookId', bookId);
    return this.http.post(`${this.baseUrl}/borrow`, null, { params });
  }

  returnBook(studentId: number, bookId: number): Observable<any> {
    const params = new HttpParams()
      .set('studentId', studentId);
    return this.http.put(`${this.baseUrl}/return/${bookId}`, null, { params });
  }

  getBorrowedCount(studentId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/borrowed/count/${studentId}`);
  }
  // addBook(book: Partial<BookModel>): Observable<BookModel> {
  //   return this.http.post<BookModel>(this.librarianBaseUrl, book);
  // }

  

  // updateBook(bookId: number, book: Partial<BookModel>): Observable<BookModel> {
  //   return this.http.put<BookModel>(`${this.librarianBaseUrl}/${bookId}`, book);
  // }

  
  refreshDashboard() {
    this.refreshSubject.next();
  }
  getBookById(bookId: number): Observable<BookModel> {
    return this.http.get<BookModel>(`${this.studentBaseUrl}/${bookId}`);
  }
}
