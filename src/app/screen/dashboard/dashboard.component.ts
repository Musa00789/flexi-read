import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/authService';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, FooterComponent, CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  dashboardData: any = {
    booksListed: 0,
    booksSold: 0,
    earnings: 0,
    recentActivity: [],
  };
  books: any[] = [];
  myBooks: any[] = [];
  page: number = 1;
  limit: number = 10;
  loading: boolean = false;
  hasMoreBooks: boolean = true;

  ngOnInit() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        console.log('Token is valid', response);
        this.authService.getDashboardData().subscribe((data) => {
          console.log(data);
          this.dashboardData = data;
        });
      },
      error: (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']);
      },
    });
    this.authService.loadMyBooks().subscribe({
      next: (response) => {
        this.books = response;
        console.log('Books loaded.');
      },
      error: (err) => {
        console.log('error fetching books: ' + err);
      },
    });
    this.myPurchases();
  }

  loadBooks() {
    if (this.loading || !this.hasMoreBooks) return;

    this.loading = true;
    this.authService.loadMyBooks().subscribe((response: any) => {
      this.books = [...this.books, ...response.books];
      this.hasMoreBooks = response.currentPage < response.totalPages;
      this.page++;
      this.loading = false;
    });
  }
  myPurchases() {
    this.authService.myPurchases().subscribe({
      next: (response) => {
        console.log('Purchases loaded.', response);
        this.myBooks = response.books;
      },
      error: (err) => {
        console.log('error fetching purchases: ' + err);
        // this.router.navigate(['/error']);
      },
    });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      this.loadBooks();
    }
  }

  downloadSalesReport() {
    this.authService.generateSaleReport().subscribe(
      (pdfData: Blob) => {
        saveAs(pdfData, 'sales-report.pdf');
      },
      (error) => {
        console.error('Error downloading sales report', error);
        // this.router.navigate(['/error']);
      }
    );
  }
  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
