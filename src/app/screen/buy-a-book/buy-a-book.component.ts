import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/authService';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { LoaderComponent } from '../Extra-Screens/loader/loader.component';

declare var bootstrap: any;

@Component({
  selector: 'app-buy-a-book',
  templateUrl: './buy-a-book.component.html',
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    RouterLink,
    HeaderComponent,
    LoaderComponent,
  ],
  styleUrls: ['./buy-a-book.component.css'],
})
export class BuyABookComponent implements OnInit {
  book: any = null;
  points: number = 0;
  uId: any;
  hasPoints: boolean = false;
  cardDetails = { cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '' };
  bookId: string = '';
  suggestedBooks: any[] = [];
  ////////////////////////
  reviews: any[] = [];
  newReview: { rating: number | null; comment: string } = {
    rating: null,
    comment: '',
  };
  reviewSuccessMessage: string = '';
  reviewErrorMessage: string = '';
  submittingReview: boolean = false;
  loading: boolean = false;
  /////////////////

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        this.uId = response.user.id;
        // this.fetchUserData(response.user.id);
        console.log('Token is valid', response);
      },
      error: (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']);
      },
    });
    this.loading = true;
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    if (this.bookId) this.getBookDetails(this.bookId);
    this.getUserPoints();
    this.loadSuggestedBooks();
    this.fetchReviews();
  }

  getBookDetails(id: string) {
    this.loading = true;
    this.authService.getBook(id).subscribe(
      (data: any) => {
        this.book = data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Failed to fetch book details', error);
        this.router.navigate(['/error']);
      }
    );
  }

  getUserPoints() {
    this.loading = true;
    this.authService.getUserPoints().subscribe(
      (data: any) => {
        this.points = data.points;
        this.hasPoints = this.points >= (this.book?.price || 0);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        // this.router.navigate(['/error']);
        console.error('Failed to fetch user points', error);
      }
    );
  }

  loadSuggestedBooks() {
    this.loading = true;
    this.authService.loadAllBooks().subscribe(
      (data: any) => {
        this.suggestedBooks = data.books;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Failed to fetch suggested books', error);
      }
    );
  }

  openPurchaseModal() {
    let modal = new bootstrap.Modal(document.getElementById('purchaseModal'));
    modal.show();
  }

  usePointsForCheckout() {
    this.loading = true;
    this.authService.purchaseBook(this.book?._id).subscribe(
      (response: any) => {
        this.points = response.remainingPoints;
        this.hasPoints = this.points >= this.book?.points;
        this.loading = false;
        alert(`Successfully purchased "${response.book?.title}"!`);
      },
      (error) => {
        this.loading = false;
        alert('Purchase failed: ' + error.error.message);
        // this.router.navigate(['/error']);
      }
    );
  }

  proceedWithCardPayment() {
    console.log('Payment Data:', { ...this.cardDetails, bookId: this.book.id });
  }

  navigateToBook(bookId: string) {
    this.router.navigate(['/view/buy-a-book', bookId]);
  }

  fetchReviews() {
    this.loading = true;
    // Example using your BookService or ReviewService:
    this.authService.getReviews(this.bookId).subscribe({
      next: (data: any) => {
        this.reviews = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching reviews:', err);
        // this.router.navigate(['/error']);
      },
    });
  }

  submitReview(form: any) {
    if (form.invalid) return;
    this.submittingReview = true;
    this.loading = true;
    this.authService.addReview(this.book._id, this.newReview).subscribe({
      next: (response) => {
        this.reviewSuccessMessage = 'Review added successfully!';
        this.newReview = { rating: null, comment: '' };
        this.fetchReviews();
        this.submittingReview = false;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to add review:', err);
        this.reviewErrorMessage = err.error?.message || 'Failed to add review.';
        this.submittingReview = false;
        // this.router.navigate(['/error']);
      },
    });
  }
}
