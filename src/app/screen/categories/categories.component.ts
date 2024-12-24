import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit, AfterViewInit {
  categories = [
    { id: 1, name: 'Fiction', image: '/Fiction.jpg' },
    { id: 2, name: 'Science', image: '/science.jpg' },
    { id: 3, name: 'Technology', image: '/technology.jpg' },
    { id: 4, name: 'History', image: '/history.jpg' },
    { id: 5, name: 'Art', image: '/art.jpg' },
    { id: 6, name: 'Biography', image: '/biography.jpg' },
    { id: 7, name: 'Fantasy', image: '/fantasy.jpg' },
    { id: 8, name: 'Romance', image: '/romance.jpg' },
    { id: 9, name: 'Thriller', image: '/thriller.jpg' },
    { id: 10, name: 'Adventure', image: '/adventure.jpg' },
    // Add more categories...
  ];

  loadedCategories: any = [];
  itemsPerLoad = 6;
  observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMoreCategories();
  }

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadMoreCategories();
        }
      });
    }, options);

    const sentinel = this.el.nativeElement.querySelector('.sentinel');
    if (sentinel) {
      this.observer.observe(sentinel);
    }
  }

  loadMoreCategories(): void {
    const start = this.loadedCategories.length;
    const end = start + this.itemsPerLoad;

    if (start < this.categories.length) {
      const newCategories = this.categories.slice(start, end);
      this.loadedCategories = [...this.loadedCategories, ...newCategories];
    }
  }

  viewCategory(id: number): void {
    console.log('View category with ID:', id);
    // Add navigation or functionality to view the selected category
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
