import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './screen/home/home.component';
import { CategoriesComponent } from './screen/categories/categories.component';
import { SellABookComponent } from './screen/sell-a-book/sell-a-book.component';
import { AuthGuard } from './AuthGuard';
import { DashboardComponent } from './screen/dashboard/dashboard.component';
import { ProfileComponent } from './screen/profile/profile.component';
import { BuyABookComponent } from './screen/buy-a-book/buy-a-book.component';
import { TopUpAccountComponent } from './screen/top-up-account/top-up-account.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'view/sell-a-book',
    component: SellABookComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view/buy-a-book/:id',
    component: BuyABookComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/topup-account',
    component: TopUpAccountComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];
