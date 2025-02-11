import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from '../../../Component/Home/footer/footer.component';
import { HeaderComponent } from '../../../Component/Home/header/header.component';
import { AuthService } from '../../../Services/authService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-word-scramble',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FooterComponent,
    HeaderComponent,
  ],
  templateUrl: './word-scramble.component.html',
  styleUrls: ['./word-scramble.component.css'],
})
export class WordScrambleComponent implements OnInit {
  private readonly DAILY_POINT_LIMIT = 400;
  words: string[] = [
    'angular',
    'typescript',
    'component',
    'template',
    'service',
  ];
  originalWord: string = '';
  scrambledWord: string = '';
  userAnswer = new FormControl('');
  message: string = '';
  pointsEarned: number = 0;
  timer: number = 30;
  interval: any;
  userId: string = '';
  maxPoints: number = 400;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.validateToken().subscribe(
      (resp) => {
        this.userId = resp.user.id;
        this.newRound();
      },
      (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']);
      }
    );
  }

  newRound() {
    this.userAnswer.setValue('');
    this.originalWord =
      this.words[Math.floor(Math.random() * this.words.length)];
    this.scrambledWord = this.shuffleWord(this.originalWord);
    this.startTimer();
  }

  shuffleWord(word: string): string {
    let scrambled = word;
    while (scrambled === word) {
      scrambled = word
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
    }
    return scrambled;
  }

  checkAnswer() {
    if (
      this.userAnswer.value?.toLowerCase() === this.originalWord.toLowerCase()
    ) {
      this.pointsEarned += 10;
      this.awardPoints(10).subscribe((result) => {
        this.message = result.message;
        this.newRound();
      });
    } else {
      this.message = '❌ Wrong answer. Try again!';
    }
  }

  awardPoints(
    pointsToAward: number
  ): Observable<{ awarded: number; message: string }> {
    return new Observable((observer) => {
      this.authService.getUserPoints().subscribe((response) => {
        const currentPoints = response?.points || 0; // Ensure it's a number
        console.log('Current Points:', currentPoints); // Debug log
        console.log('Points to Award:', pointsToAward); // Debug log
        const remaining = this.DAILY_POINT_LIMIT - currentPoints;
        // if (remaining <= 0) {
        //   observer.next({ awarded: 0, message: '⚠️ Daily limit reached' });
        //   observer.complete();
        //   return;
        // }

        const finalAward = Math.min(pointsToAward, remaining);
        const newPoints = currentPoints + finalAward;
        console.log('New Points:', newPoints); // Debug log'
        console.log('Final Award:', finalAward); // Debug log

        this.authService.addPoints(newPoints).subscribe(
          () => {
            observer.next({
              awarded: finalAward,
              message: '✅ Points awarded successfully',
            });
            observer.complete();
          },
          (error) => observer.error(error)
        );
      });
    });
  }

  startTimer() {
    clearInterval(this.interval);
    this.timer = 30;
    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        clearInterval(this.interval);
        this.message = `⏳ Time up! The correct word was: ${this.originalWord}`;

        setTimeout(() => this.newRound(), 2000);
      }
    }, 1000);
  }
}
