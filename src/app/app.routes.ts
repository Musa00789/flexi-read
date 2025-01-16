import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './screen/home/home.component';
import { CategoriesComponent } from './screen/categories/categories.component';
import { SellABookComponent } from './screen/sell-a-book/sell-a-book.component';
import { AuthGuard } from './AuthGuard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: HomeComponent },
  { path: 'categories', component: CategoriesComponent },
  {
    path: 'seller/view',
    component: SellABookComponent,
    canActivate: [AuthGuard],
  },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];
