import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../Component/Home/header/header.component';
import { FooterComponent } from '../../../Component/Home/footer/footer.component';
import { AuthService } from '../../../Services/authService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-math-challenge',
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './math-challenge.component.html',
  styleUrl: './math-challenge.component.css',
})
export class MathChallengeComponent implements OnInit {
  private readonly DAILY_POINT_LIMIT = 400;

  num1: number = 0;
  num2: number = 0;
  correctAnswer: number = 0;
  options: number[] = [];
  message: string = '';
  points: number = 0;
  maxPoints: number = 400;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.validateToken().subscribe(
      () => {
        this.generateQuestion();
        console.log('Token is valid');
      },
      (err) => {
        console.error('Token validation failed');
        this.router.navigate(['/login']);
      }
    );
  }

  generateQuestion() {
    this.num1 = Math.floor(Math.random() * 10) + 1;
    this.num2 = Math.floor(Math.random() * 10) + 1;
    this.correctAnswer = this.num1 + this.num2;

    this.options = [
      this.correctAnswer,
      this.correctAnswer + Math.floor(Math.random() * 5) + 1,
      this.correctAnswer - Math.floor(Math.random() * 5) - 1,
    ];

    this.options.sort(() => Math.random() - 0.5);
  }

  submitAnswer(answer: number) {
    if (answer === this.correctAnswer) {
      this.message = '✅ Correct! You earned 10 points.';
      this.awardPoints(10).subscribe((result) => {
        this.message = result.message;
      });
      this.points += 10;
    } else {
      this.message = '❌ Incorrect! Try another problem.';
    }

    setTimeout(() => {
      this.message = '';
      this.generateQuestion();
    }, 1500);
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
}
