import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { HeroComponent } from '../../Component/Home/hero/hero.component';
import { CategoriesComponent } from '../../Component/Home/categories/categories.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { AuthService } from '../../Services/authService';
import { Router } from '@angular/router';
import { LoaderComponent } from '../Extra-Screens/loader/loader.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    HeroComponent,
    CategoriesComponent,
    FooterComponent,
    LoaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        console.log('Token is valid', response);
      },
      error: (err) => {
        console.error('Token validation failed', err);
        // this.router.navigate(['/login']); // Redirect to login if invalid
      },
    });
  }
}
