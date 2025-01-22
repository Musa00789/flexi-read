import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { AuthService } from '../../Services/authService';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-sell-abook',
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sell-a-book.component.html',
  styleUrl: './sell-a-book.component.css',
})
export class SellABookComponent implements OnInit {
  sellBookForm: FormGroup | any;
  categories = [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'Technology' },
    { id: 4, name: 'History' },
    { id: 5, name: 'Art' },
  ];
  books: any = [];

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
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      filePath: [null, [Validators.required, Validators.min(1)]],
    });
  }
  ngOnInit(): void {
    this.authService.validateToken().subscribe({
      next: (response) => {
        console.log('Token is valid', response);
      },
      error: (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']);
      },
    });
    this.authService.loadBooks();
  }

  onSubmit() {
    if (this.sellBookForm.valid) {
      console.log('Book Details:', this.sellBookForm.value);
      // alert('Book listed successfully!');
      const formData = new FormData();
      formData.append('title', this.sellBookForm.get('title').value);
      formData.append('author', this.sellBookForm.get('author').value);
      formData.append('category', this.sellBookForm.get('category').value);
      formData.append('price', this.sellBookForm.get('price').value);
      formData.append('filePath', this.sellBookForm.get('filePath').value);
      this.authService.uploadBook(formData).subscribe(() => {
        this.authService.loadBooks(); // Reload books after successful upload
      });
    }
  }
  getCategoryName(categoryId: number) {
    return this.categories.find((category) => category.id === categoryId)?.name;
  }

  openUploadModal() {
    if (isPlatformBrowser(this.platformId)) {
      import('bootstrap').then((bootstrap) => {
        const modalElement = document.getElementById('uploadBookModal');
        if (modalElement) {
          const modalInstance = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: true,
          });
          modalInstance.show();
        }
      });
    } else {
      console.error('Bootstrap modals cannot run during SSR');
    }
  }
}
