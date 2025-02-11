import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../Services/authService';

@Component({
  selector: 'app-categories',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    // RouterLink,
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  allBooks: any[] = [];
  ownedBooks: any[] = [];
  isAllBooksSelected = true;
  displayedBooks: any[] = [];
  types: boolean = true;
  searchQuery: string = '';
  selectedCategories: Set<number> = new Set();
  filteredBooks: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        console.log('Token is valid', response);
      },
      error: (err) => {
        console.error('Token validation failed', err);
        // this.router.navigate(['/login']);
      },
    });

    this.authService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: () => {
        this.categories = [];
        this.router.navigate(['/error']);
        console.error('Failed to fetch categories');
      },
    });

    this.loadBooks();
  }

  toggleCategory(categoryId: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedCategories.add(categoryId);
    } else {
      this.selectedCategories.delete(categoryId);
    }
    console.log('Selected categories:', Array.from(this.selectedCategories));
    this.filterBooks();
  }

  isCategorySelected(categoryId: any): boolean {
    return this.selectedCategories.has(categoryId);
  }

  filterBooks() {
    const query = this.searchQuery.toLowerCase();

    this.filteredBooks = this.displayedBooks.filter((book) => {
      const matchesCategory =
        this.selectedCategories.size === 0 ||
        book.category.some((category: any) =>
          this.selectedCategories.has(category)
        );

      const matchesQuery = book.title.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }

  searchBooks() {
    this.filterBooks();
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  loadBooks() {
    if (this.types) {
      this.authService.loadAllBooks().subscribe({
        next: (response) => {
          this.allBooks = response.books;
          this.displayedBooks = [...this.allBooks];
          this.filteredBooks = [...this.allBooks];
        },
        error: (err) => {
          console.log('Error fetching all books: ' + err);
          this.router.navigate(['/error']);
        },
      });
    } else {
      this.authService.validateToken().subscribe(
        () => {
          this.authService.myPurchases().subscribe({
            next: (response) => {
              this.allBooks = response.books;
              this.displayedBooks = [...this.allBooks];
              this.filteredBooks = [...this.allBooks];
            },
            error: (err) => {
              console.log('Error fetching owned books: ' + err);
              this.router.navigate(['/error']);
            },
          });
        },
        (error) => {
          console.log('Validate token failed.' + error);
          alert('Login to read your books');
          this.router.navigate(['/login']);
        }
      );
    }
  }

  readBuy(type: boolean, book: any) {
    const bookId = book?.id ? book.id : book?._id;
    if (!bookId) {
      console.error('Book ID is undefined', book);

      return;
    }

    if (!type) {
      this.router.navigate(['/books/owned/read', bookId]);
    } else {
      this.router.navigate(['/view/buy-a-book', book?._id]);
    }
  }

  toggleTab(tab: string) {
    if (tab === 'all') {
      this.types = true;
    } else {
      this.types = false;
    }
    this.loadBooks();
  }
}
