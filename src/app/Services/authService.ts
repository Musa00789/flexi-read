import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

interface ChatResponse {
  session_id: string;
  reply: string;
}

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
  private sessionId: string | null = null;
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

  sendPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrlUser}/forgotPassword`, email);
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

  updateProfile(id: string, updateData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(
      `${this.baseUrlUser}/updateProfile`,
      { updateData },
      {
        headers,
      }
    );
  }
  changeRole(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(
      `${this.baseUrlUser}/changeRole`,
      {},
      { headers }
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

  randomBooks(): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrlUser}/randomBooks`, { headers });
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
  addPoints(points: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(
      `${this.baseUrlUser}/rewardPoints`,
      { points },
      { headers }
    );
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

  getReviews(bookId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrlUser}/getReviews/${bookId}`);
  }

  addReview(
    bookId: string,
    reviewData: { rating: number | null; comment: string }
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(
      `${this.baseUrlUser}/addReview/${bookId}`,
      { reviewData },
      { headers }
    );
  }

  getSummary(text: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<{ summary: string }>(
      `${this.baseUrlUser}/summarize`,
      { text },
      { headers }
    );
  }
  ///////////////////////////////////test
  // getExpanded(text: string): Observable<any> {
  //   console.log('summary');
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.post(
  //     `${this.baseUrlUser}/getSummary`,
  //     { text },
  //     { headers }
  //   );
  // }

  doPayment(amount: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(
      `${this.baseUrlUser}/payment`,
      { amount },
      { headers }
    );
  }

  sendMessage(message: string): Observable<ChatResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .post<ChatResponse>(
        `${this.baseUrlUser}/api/chat`,
        {
          session_id: this.sessionId,
          message: message,
        },
        { headers }
      )
      .pipe(
        tap((res) => {
          // persist the session ID for follow-up messages
          this.sessionId = res.session_id;
        })
      );
  }
}
