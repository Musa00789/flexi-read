import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { AuthService } from '../../Services/authService';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;

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
  styleUrls: ['./profile.component.css'], // Fixed: styleUrls (plural)
})
export class ProfileComponent implements OnInit {
  user: any;
  editUser: any = { username: '', password: '', confirmPassword: '' };
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
        console.log('Orders loaded.', this.orders);
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

  openEditModal() {
    const modal = new bootstrap.Modal(
      document.getElementById('editProfileModal')
    );
    modal.show();
  }

  // Handle profile update using a single API call
  updateProfile() {
    if (
      this.editUser.password &&
      this.editUser.password !== this.editUser.confirmPassword
    ) {
      alert('Passwords do not match!');
      return;
    }

    // Prepare update data; email is omitted because email updates are not allowed here.
    const updateData: any = { username: this.editUser.username };
    if (this.editUser.password) {
      updateData.password = this.editUser.password;
    }

    // Call the single API endpoint without passing the user id (the token provides it)
    this.authService.updateProfile(this.user._id, updateData).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.fetchUserData(this.user._id);
        // Optionally reset the editUser object here:
        this.editUser = { username: '', password: '', confirmPassword: '' };
        // And close the modal:
        const modalEl = document.getElementById('editProfileModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
      },
      error: (err) => console.error('Error updating profile:', err),
    });
  }
}
