import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HeaderComponent } from '../../../Component/Home/header/header.component';
import { FooterComponent } from '../../../Component/Home/footer/footer.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/authService';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trivia-quiz',
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './trivia-quiz.component.html',
  styleUrl: './trivia-quiz.component.css',
})
export class TriviaQuizComponent implements OnInit {
  private readonly DAILY_POINT_LIMIT = 400;

  questions = [
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'Berlin', 'Madrid'],
      answer: 'Paris',
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter'],
      answer: 'Mars',
    },
    {
      question: 'Who wrote Hamlet?',
      options: ['Shakespeare', 'Hemingway', 'Tolkien'],
      answer: 'Shakespeare',
    },
  ];
  currentQuestionIndex: number = 0;
  selectedAnswer: string | null = null;
  message: string = '';
  points: number = 0;
  maxPoints: number = 400;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.validateToken().subscribe(
      (resp) => {
        console.log('Token is valid');
        this.loadNextQuestion();
      },
      (err) => {
        console.error('Token validation failed' + err);
        this.router.navigate(['/login']);
      }
    );
  }

  loadNextQuestion() {
    this.selectedAnswer = null;
    this.currentQuestionIndex = Math.floor(
      Math.random() * this.questions.length
    );
  }

  submitAnswer(option: string) {
    if (this.selectedAnswer) return;

    this.selectedAnswer = option;
    if (option === this.questions[this.currentQuestionIndex].answer) {
      this.message = '✅ Correct! You earned 10 points.';
      this.awardPoints(10);
      this.points += 10;
    } else {
      this.message = '❌ Incorrect! Try another question.';
    }

    setTimeout(() => {
      this.message = '';
      this.loadNextQuestion();
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
