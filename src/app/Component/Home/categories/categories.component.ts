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
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Non-fiction',
      description: 'Learn new things.',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Children',
      description: 'Books for kids.',
      image: 'https://via.placeholder.com/150',
    },
  ];
}
