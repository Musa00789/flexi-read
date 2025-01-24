import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/authService';

@Component({
  selector: 'app-categories',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  books: any[] = [];
  types: boolean = true;
  // books = [
  //   {
  //     id: 1,
  //     name: 'Book One',
  //     author: 'Author A',
  //     coverImage: 'Fiction.jpg',
  //     price: 500,
  //     points: null,
  //     rating: 4,
  //     categoryIds: [1, 2],
  //   },
  //   {
  //     id: 2,
  //     name: 'Book Two',
  //     author: 'Author B',
  //     coverImage: 'Fiction.jpg',
  //     price: null,
  //     points: 100,
  //     rating: 5,
  //     categoryIds: [3],
  //   },
  // ];

  searchQuery: string = '';
  selectedCategories: Set<number> = new Set();
  filteredBooks: any[] = [];
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.filteredBooks = [...this.books];

    this.authService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: () => {
        this.categories = [];
        console.error('Failed to fetch categories');
      },
    });

    this.authService.loadAllBooks().subscribe({
      next: (response) => {
        this.books = response;
        console.log('Books loaded.');
      },
      error: (err) => {
        console.log('error fetching books: ' + err);
      },
    });

    this.authService.validateToken().subscribe({
      next: (response) => {
        console.log('Token is valid', response);
      },
      error: (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']);
      },
    });
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

  // filterBooks() {
  //   const query = this.searchQuery.toLowerCase();

  //   this.filteredBooks = this.books.filter((book) => {
  //     const matchesCategory =
  //       this.selectedCategories.size === 0 ||
  //       book.categoryIds.some((id: any) => this.selectedCategories.has(id));

  //     const matchesQuery = book.name.toLowerCase().includes(query);

  //     return matchesCategory && matchesQuery;
  //   });
  // }

  filterBooks() {
    const query = this.searchQuery.toLowerCase();

    this.filteredBooks = this.books.filter((book) => {
      const matchesCategory =
        this.selectedCategories.size === 0 ||
        book.categories.some((category: any) =>
          this.selectedCategories.has(category._id)
        );

      const matchesQuery = book.name.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }

  searchBooks() {
    this.filterBooks();
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
