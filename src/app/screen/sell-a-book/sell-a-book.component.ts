import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { Router } from '@angular/router';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { AuthService } from '../../Services/authService';
import { HttpClient } from '@angular/common/http';
// import * as bootstrap from 'bootstrap';

declare var bootstrap: any;
@Component({
  selector: 'app-sell-abook',
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  templateUrl: './sell-a-book.component.html',
  styleUrl: './sell-a-book.component.css',
})
export class SellABookComponent implements OnInit {
  sellBookForm: FormGroup | any;
  categories: any = [];
  books: any = [];
  loadingBooks: boolean = false;
  loadingCategories: boolean = false;
  editBookForm: FormGroup | any;
  selectedBookId: string | null = null;
  selectedBookImage: File | null = null;
  selectedCategories: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.sellBookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: [[], Validators.required],
      price: [, [Validators.required, Validators.min(1)]],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      points: [10, [Validators.required, Validators.min(1)]],
      filePath: [null, [Validators.required, Validators.min(1)]],
      bookCoverImage: [null, [Validators.required, Validators.min(1)]],
    });

    this.editBookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: [[], Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
    });
  }
  ngOnInit(): void {
    this.loadingBooks = true;
    this.loadingCategories = true;
    this.authService.validateToken().subscribe({
      next: (response) => {
        console.log('Token is valid', response);
      },
      error: (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']);
      },
    });
    this.loadBooks();
    this.authService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.router.navigate(['/error']);
      },
    });
  }

  onSubmit() {
    if (this.sellBookForm.valid) {
      const formData = new FormData();
      formData.append('title', this.sellBookForm.get('title').value);
      formData.append('author', this.sellBookForm.get('author').value);
      formData.append('category', this.sellBookForm.get('category').value);
      formData.append('price', this.sellBookForm.get('price').value);
      formData.append('rating', this.sellBookForm.get('rating').value);
      formData.append('points', this.sellBookForm.get('points').value);
      formData.append('file', this.sellBookForm.get('filePath').value);
      formData.append(
        'bookCoverImage',
        this.sellBookForm.get('bookCoverImage').value
      );

      this.authService.uploadBook(formData).subscribe({
        next: (response) => {
          console.log('Book uploaded successfully:', response);
          this.authService.loadMyBooks();
          this.sellBookForm.reset();
          this.closeUploadModal();
        },
        error: (err) => {
          console.error('Failed to upload book:', err);
          this.router.navigate(['/error']);
        },
      });
    }
  }

  loadBooks() {
    this.authService.loadMyBooks().subscribe({
      next: (response) => {
        this.books = response;
        this.loadingBooks = false;
      },
      error: (err) => {
        console.error('Failed to load books:', err);
        this.loadingBooks = false;
        this.router.navigate(['/error']);
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.sellBookForm.patchValue({
        filePath: file,
      });
    }
  }
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.sellBookForm.patchValue({
        bookCoverImage: file,
      });
    }
  }
  getStars(rating: number): number[] {
    return new Array(Math.floor(rating));
  }

  getCategoryName(categoryId: number) {
    return this.categories.find((category: any) => category._id === categoryId)
      ?.name;
  }

  deleteBook(id: string) {
    this.authService.deleteBook(id).subscribe({
      next: (response) => {
        console.log('Book deleted successfully:', response);
        this.books = this.books.filter((book: any) => book._id !== id);
      },
      error: (err) => {
        console.error('Failed to delete book:', err);
        this.router.navigate(['/error']);
      },
    });
  }

  confirmDelete(bookId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (confirmed) {
      this.deleteBook(bookId);
    }
  }

  openUploadModal() {
    if (isPlatformBrowser(this.platformId)) {
      import('bootstrap').then((bootstrap) => {
        const modalElement = document.getElementById('uploadBookModal');
        if (modalElement) {
          const modalInstance = new bootstrap.Modal(modalElement, {
            // backdrop: 'static',
            keyboard: true,
          });
          modalInstance.show();
        }
      });
    } else {
      console.error('Bootstrap modals cannot run during SSR');
      this.router.navigate(['/error']);
    }
  }
  closeUploadModal() {
    if (isPlatformBrowser(this.platformId)) {
      import('bootstrap').then((bootstrap) => {
        const modalElement = document.getElementById('uploadBookModal');
        if (modalElement) {
          const modalInstance = new bootstrap.Modal(modalElement, {
            // backdrop: 'static',
            keyboard: true,
          });
          modalInstance.hide();
        }
      });
    } else {
      console.error('Bootstrap modals cannot run during SSR');
      this.router.navigate(['/error']);
    }
  }

  openEditModal(book: any) {
    this.selectedBookId = book._id;
    this.editBookForm.patchValue({
      title: book.title,
      author: book.author,
      category: book.category.map((cat: any) => cat._id),
      price: book.price,
    });

    let editBookModal = new bootstrap.Modal(
      document.getElementById('editBookModal')
    );
    editBookModal.show();
  }

  onEditImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedBookImage = file;
    }
  }

  updateBook() {
    if (!this.selectedBookId) return;

    const formData = new FormData();
    formData.append('title', this.editBookForm.value.title);
    formData.append('author', this.editBookForm.value.author);
    formData.append(
      'category',
      this.editBookForm.get('category').value === null
        ? '[]'
        : JSON.stringify(this.editBookForm.get('category').value)
    );
    formData.append('price', this.editBookForm.value.price);

    if (this.selectedBookImage) {
      formData.append('bookCoverImage', this.selectedBookImage);
    }

    this.authService.updateBook(this.selectedBookId, formData).subscribe(
      (response) => {
        alert('Book updated successfully!');
        this.loadBooks();
        console.log('Book updated:', response);
        bootstrap.Modal.getInstance(
          document.getElementById('editBookModal')
        ).hide();
      },
      (error) => {
        console.error('Error updating book:', error);
        this.router.navigate(['/error']);
      }
    );
  }
}
