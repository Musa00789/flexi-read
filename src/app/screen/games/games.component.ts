import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { AuthService } from '../../Services/authService';

@Component({
  selector: 'app-games',
  imports: [HeaderComponent, FooterComponent, RouterLink, CommonModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css',
})
export class GamesComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.validateToken().subscribe(
      () => {
        console.log('Token is valid');
      },
      (err) => {
        console.error('Token validation failed');
        this.router.navigate(['/login']);
      }
    );
  }
  games = [
    {
      name: 'Word Scramble',
      description: 'Test your vocabulary skills and earn points!',
      route: '/games/word-scramble',
      icon: 'fas fa-brain',
    },
    {
      name: 'Memory Match',
      description: 'Match cards and train your memory!',
      route: '/games/memory-match',
      icon: 'fas fa-gamepad',
    },
    {
      name: 'Math Challenge',
      description: 'Solve quick math problems under time pressure!',
      route: '/games/math-challenge',
      icon: 'fas fa-calculator',
    },
    {
      name: 'Trivia Quiz',
      description: 'Answer trivia questions and prove your knowledge!',
      route: '/games/trivia-quiz',
      icon: 'fas fa-question-circle',
    },
    {
      name: 'Speed Typing',
      description: 'Test your typing speed and accuracy!',
      route: '/comming-soon',
      icon: 'fas fa-keyboard',
    },
    {
      name: 'Puzzle Solver',
      description: 'Solve logical puzzles to earn points!',
      route: '/comming-soon',
      icon: 'fas fa-puzzle-piece',
    },
  ];
}
