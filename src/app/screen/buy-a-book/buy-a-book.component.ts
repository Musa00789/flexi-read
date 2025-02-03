import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/authService';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { HeaderComponent } from '../../Component/Home/header/header.component';

declare var bootstrap: any;

@Component({
  selector: 'app-buy-a-book',
  templateUrl: './buy-a-book.component.html',
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent],
  styleUrls: ['./buy-a-book.component.css'],
})
export class BuyABookComponent implements OnInit {
  book: any = null;
  points: number = 0;
  hasPoints: boolean = false;
  cardDetails = { cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '' };
  bookId: string = '';
  suggestedBooks: any[] = [];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        // this.fetchUserData(response.user.id);
        console.log('Token is valid', response);
      },
      error: (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']); // Redirect to login if invalid
      },
    });
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    if (this.bookId) this.getBookDetails(this.bookId);
    this.getUserPoints();
    this.loadSuggestedBooks();
  }

  getBookDetails(id: string) {
    this.authService.getBook(id).subscribe(
      (data: any) => {
        this.book = data;
      },
      (error) => {
        console.error('Failed to fetch book details', error);
      }
    );
  }

  getUserPoints() {
    this.authService.getUserPoints().subscribe(
      (data: any) => {
        this.points = data.points;
        this.hasPoints = this.points >= (this.book?.price || 0);
      },
      (error) => {
        console.error('Failed to fetch user points', error);
      }
    );
  }

  loadSuggestedBooks() {
    this.authService.loadAllBooks().subscribe(
      (data: any) => {
        this.suggestedBooks = data.books;
      },
      (error) => {
        console.error('Failed to fetch suggested books', error);
      }
    );
  }

  openPurchaseModal() {
    let modal = new bootstrap.Modal(document.getElementById('purchaseModal'));
    modal.show();
  }

  usePointsForCheckout() {
    this.authService.purchaseBook(this.book?._id).subscribe(
      (response: any) => {
        alert(`Successfully purchased "${response.book?.title}"!`);
        this.points = response.remainingPoints;
        this.hasPoints = this.points >= this.book?.points;
      },
      (error) => {
        alert('Purchase failed: ' + error.error.message);
      }
    );
  }

  proceedWithCardPayment() {
    console.log('Payment Data:', { ...this.cardDetails, bookId: this.book.id });
  }

  navigateToBook(bookId: string) {
    this.router.navigate(['/buy-a-book', bookId]);
  }
}
