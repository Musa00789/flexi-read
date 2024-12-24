import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { HeaderComponent } from '../../Component/Home/header/header.component';

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
export class SellABookComponent {
  sellBookForm: FormGroup | any;
  categories = [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'Technology' },
    { id: 4, name: 'History' },
    { id: 5, name: 'Art' },
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    const isLoggedIn = !!localStorage.getItem('user');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }

    this.sellBookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.sellBookForm.valid) {
      console.log('Book Details:', this.sellBookForm.value);
      alert('Book listed successfully!');
      this.router.navigate(['/home']);
    }
  }
}
