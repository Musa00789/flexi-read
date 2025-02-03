import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  private baseUrlUser = 'http://localhost:5000/api/auth';
  // private baseUrlAdmin = 'http://localhost:5000/api/admin';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  hasToken(): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    this.isLoggedInSubject.next(true);
    return this.http.post(`${this.baseUrlUser}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
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
    this.isLoggedInSubject.next(true);
    return this.http.post(`${this.baseUrlUser}/signup`, updatedCredentials);
  }

  loginAdmin(credentials: {
    email: string;
    password: string;
  }): Observable<any> {
    this.isLoggedInSubject.next(true);
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
    this.isLoggedInSubject.next(true);
    return this.http.post(`${this.baseUrlUser}/signup`, updatedCredentials);
  }

  validateToken(): Observable<any> {
    try {
      if (!this.isBrowser()) {
        throw new Error('Cannot validate token on the server.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      return this.http.post(
        `${this.baseUrlUser}/validate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.log(error);
      return new Observable<any>((observer) => {
        observer.error(error);
      });
    }
  }
  getUser(id: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.baseUrlUser}/user/${id}`, { headers });
  }

  uploadProfile(id: String, picture: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      `${this.baseUrlUser}/uploadProfile/${id}`,
      picture,
      {
        headers,
      }
    );
  }

  getDashboardData(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.baseUrlUser}/dashboard`, { headers });
  }

  generateSaleReport(): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrlUser}/sales-report`, {
      responseType: 'blob',
      headers,
    });
  }

  loadAllBooks(): Observable<any> {
    return this.http.get(`${this.baseUrlUser}/getAllBooks`);
  }

  loadMyBooks(): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrlUser}/getMyBooks`, { headers });
  }

  getBook(id: string): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrlUser}/getBook/${id}`, { headers });
  }

  // Upload a new book
  uploadBook(data: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.baseUrlUser}/uploadBook`, data, { headers });
  }

  updateBook(id: string, data: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(`${this.baseUrlUser}/updateBook/${id}`, data, {
      headers,
    });
  }

  purchaseBook(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(
      `${this.baseUrlUser}/purchaseBook/${id}`,
      {},
      {
        headers,
      }
    );
  }

  myPurchases(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrlUser}/myPurchases`, { headers });
  }

  getUserPoints(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrlUser}/getUserPoints`, { headers });
  }

  deleteBook(id: String): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.baseUrlUser}/deleteBook/${id}`, {
      headers,
    });
  }
  getCategories(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrlUser}/getCategories`, { headers });
  }
  addCategory(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrlUser}/addCategory`, { headers });
  }
  deleteCategory(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrlUser}/getCategory`, { headers });
  }

  getMyOrders(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrlUser}/getMyOrders`, { headers });
  }
}
