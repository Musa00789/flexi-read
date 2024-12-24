import { Component } from '@angular/core';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { HeroComponent } from '../../Component/Home/hero/hero.component';
import { CategoriesComponent } from '../../Component/Home/categories/categories.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    HeroComponent,
    CategoriesComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
