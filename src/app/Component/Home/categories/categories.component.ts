import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  categories = [
    {
      name: 'Fiction',
      description: 'Explore amazing stories.',
      image: 'Fiction.jpg',
    },
    {
      name: 'Non-fiction',
      description: 'Learn new things.',
      image: 'non-fictional.jpg',
    },
    {
      name: 'Children',
      description: 'Books for kids.',
      image: 'story.jpg',
    },
  ];
}
