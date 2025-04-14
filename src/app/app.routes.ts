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
import { WordScrambleComponent } from './screen/GamesList/word-scramble/word-scramble.component';
import { GamesComponent } from './screen/games/games.component';
import { MemoryMatchComponent } from './screen/GamesList/memory-match/memory-match.component';
import { TriviaQuizComponent } from './screen/GamesList/trivia-quiz/trivia-quiz.component';
import { MathChallengeComponent } from './screen/GamesList/math-challenge/math-challenge.component';
import { ComingSoonComponent } from './screen/Extra-Screens/coming-soon/coming-soon.component';
import { BecomeAWriterComponent } from './screen/Extra-Screens/become-a-writer/become-a-writer.component';
import { ReadBookComponent } from './screen/read-book/read-book.component';
import { ErrorScreenComponent } from './screen/Extra-Screens/error-screen/error-screen.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categories/:name',
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
    path: 'profile/topup-account/:id',
    component: TopUpAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'games/word-scramble',
    component: WordScrambleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'games/memory-match',
    component: MemoryMatchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'games/trivia-quiz',
    component: TriviaQuizComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'games/math-challenge',
    component: MathChallengeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'books/owned/read/:id',
    component: ReadBookComponent,
    canActivate: [AuthGuard],
  },
  { path: 'games/:id', component: GamesComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'comming-soon', component: ComingSoonComponent },
  {
    path: 'become-a-writer',
    component: BecomeAWriterComponent,
    canActivate: [AuthGuard],
  },
  { path: 'signup', component: SignupComponent },
  { path: 'error', component: ErrorScreenComponent },
  {
    path: 'bewriter',
    component: BecomeAWriterComponent,
    canActivate: [AuthGuard],
  },
];
