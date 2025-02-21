import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../Services/authService';
import { LoaderComponent } from '../Extra-Screens/loader/loader.component';

@Component({
  selector: 'app-categories',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    LoaderComponent,
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
  categoryName: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryName = this.route.snapshot.paramMap.get('name') || '';
    this.authService.validateToken().subscribe({
      next: (response) => {
        console.log('Token is valid', response);
      },
      error: (err) => {
        console.error('Token validation failed', err);
        // this.router.navigate(['/login']);
      },
    });
    this.loading = true;
    this.loadBooks();
    console.log('this is the category name', this.categoryName);
    this.authService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: () => {
        this.loading = false;
        console.error('Failed to fetch categories');
        // this.router.navigate(['/error']);
      },
    });
    this.preselectCategory();
  }

  preselectCategory() {
    if (!this.categoryName || this.categoryName.toLowerCase() === 'all') return;

    const matchingCategory = this.categories.find((cat) => {
      cat.name.toLowerCase() === this.categoryName.toLowerCase();
      console.log('Matching category:', cat);
    });

    if (matchingCategory) {
      this.selectedCategories.add(matchingCategory._id);
      console.log(
        'Preselected category:',
        matchingCategory,
        '+',
        this.selectedCategories
      );
    }

    this.filterBooks();
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
      this.loading = true;
      this.authService.loadAllBooks().subscribe({
        next: (response) => {
          this.allBooks = response.books;
          this.displayedBooks = [...this.allBooks];
          this.filteredBooks = [...this.allBooks];
          if (this.selectedCategories.size > 0) {
            this.filterBooks();
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.allBooks = [];
          this.displayedBooks = [];
          this.filteredBooks = [];
          console.log('Error fetching all books: ' + err);
          alert('Error fetching all books');
          // this.router.navigate(['/error']);
        },
      });
    } else {
      this.loading = true;
      this.authService.validateToken().subscribe(
        () => {
          this.authService.myPurchases().subscribe({
            next: (response) => {
              this.allBooks = response.books;
              this.displayedBooks = [...this.allBooks];
              this.filteredBooks = [...this.allBooks];
              this.loading = false;
            },
            error: (err) => {
              this.loading = false;
              this.allBooks = [];
              this.displayedBooks = [];
              this.filteredBooks = [];
              console.log('Error fetching owned books: ' + err);
              // this.router.navigate(['/error']);
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
