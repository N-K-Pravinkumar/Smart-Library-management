import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(credentials: { email: string; password: string; }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  getStudentByEmail(email: string): Observable<{ id: number; username: string }> {
  return this.http.get<{ id: number; username: string }>(
    `http://localhost:8080/api/student/email/${encodeURIComponent(email)}`
  );
}
}
