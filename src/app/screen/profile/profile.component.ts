import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { AuthService } from '../../Services/authService';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: any;
  orders: any;
  pointsToAdd: number = 0;
  showEditIcon = false;
  books: any[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        this.fetchUserData(response.user.id);
        console.log('Token is valid', response);
      },
      error: (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']); // Redirect to login if invalid
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

    this.getMyOrders();
  }

  getMyOrders() {
    this.authService.myPurchases().subscribe({
      next: (response) => {
        this.orders = response.books;
        console.log('Orders loaded.' + this.orders);
      },
      error: (err) => {
        console.log('error fetching orders: ' + err);
      },
    });
  }

  fetchUserData(id: any) {
    this.authService.getUser(id).subscribe(
      (response) => {
        this.user = response.user;
      },
      (error) => {
        console.error('Error fetching user data', error);
      }
    );
  }

  viewBook(bookId: number) {
    console.log(`Navigating to book ID: ${bookId}`);
    // Implement navigation logic (e.g., this.router.navigate([`/book/${bookId}`]))
  }

  uploadProfilePicture() {
    this.fileInput.nativeElement.click();
  }
  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);

      this.authService.uploadProfile(this.user?._id, formData).subscribe(
        (response) => {
          this.fetchUserData(this.user?._id);
        },
        (error) => {
          console.error('Error uploading profile picture', error);
        }
      );
    }
  }

  viewOrder(orderId: string) {
    console.log(`Navigating to order ID: ${orderId}`);
    // Implement navigation logic (e.g., this.router.navigate([`/order/${orderId}`]))
  }
}
