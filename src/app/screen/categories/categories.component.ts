import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories = [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
    { id: 3, name: 'Science' },
    { id: 4, name: 'Biography' },
  ];

  books = [
    {
      id: 1,
      name: 'Book One',
      author: 'Author A',
      coverImage: 'Fiction.jpg',
      price: 500,
      points: null,
      rating: 4,
      categoryIds: [1, 2],
    },
    {
      id: 2,
      name: 'Book Two',
      author: 'Author B',
      coverImage: 'Fiction.jpg',
      price: null,
      points: 100,
      rating: 5,
      categoryIds: [3],
    },
    // Add more book objects here
  ];

  searchQuery: string = '';
  selectedCategories: Set<number> = new Set();
  filteredBooks: any[] = [];

  ngOnInit() {
    this.filteredBooks = [...this.books];
  }

  toggleCategory(categoryId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedCategories.add(categoryId);
    } else {
      this.selectedCategories.delete(categoryId);
    }

    this.filterBooks();
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategories.has(categoryId);
  }

  filterBooks() {
    const query = this.searchQuery.toLowerCase();

    this.filteredBooks = this.books.filter((book) => {
      const matchesCategory =
        this.selectedCategories.size === 0 ||
        book.categoryIds.some((id) => this.selectedCategories.has(id));

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
