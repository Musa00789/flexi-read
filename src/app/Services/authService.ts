import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private baseUrlUser = 'http://localhost:5000/api/auth';
  // private baseUrlAdmin = 'http://localhost:5000/api/admin';

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrlUser}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  signUp(credentials: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Observable<any> {
    const updatedCredentials = {
      ...credentials,
      role: credentials.role || 'User',
    };
    return this.http.post(`${this.baseUrlUser}/signup`, updatedCredentials);
  }

  loginAdmin(credentials: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrlUser}/login`, credentials);
  }

  signUpAdmin(credentials: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Observable<any> {
    const updatedCredentials = {
      ...credentials,
      role: credentials.role || 'Admin',
    };
    return this.http.post(`${this.baseUrlUser}/signup`, updatedCredentials);
  }

  validateToken(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    return this.http.post(
      `${this.baseUrlUser}/validate`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}
