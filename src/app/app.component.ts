import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './Component/Home/header/header.component';
import { FooterComponent } from './Component/Home/footer/footer.component';
import { CategoriesComponent } from './Component/Home/categories/categories.component';
import { HeroComponent } from './Component/Home/hero/hero.component';

@Component({
  selector: 'app-root',
  imports: [
    // HeaderComponent,
    // HeroComponent,
    // CategoriesComponent,
    // FooterComponent,
    CommonModule,
    RouterOutlet,
    // RouterLink,
    // RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'flexi-read';
}
