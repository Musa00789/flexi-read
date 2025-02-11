import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../Component/Home/header/header.component';
import { FooterComponent } from '../../../Component/Home/footer/footer.component';
import { AuthService } from '../../../Services/authService';

@Component({
  selector: 'app-memory-match',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './memory-match.component.html',
  styleUrl: './memory-match.component.css',
})
export class MemoryMatchComponent implements OnInit {
  cards = [
    { value: 1, isFlipped: false },
    { value: 1, isFlipped: false },
    { value: 2, isFlipped: false },
    { value: 2, isFlipped: false },
    { value: 3, isFlipped: false },
    { value: 3, isFlipped: false },
    { value: 4, isFlipped: false },
    { value: 4, isFlipped: false },
    { value: 5, isFlipped: false },
    { value: 5, isFlipped: false },
    { value: 6, isFlipped: false },
    { value: 6, isFlipped: false },
  ];
  flippedCards: any[] = [];
  matchedCards: any[] = [];
  message: string = '';
  pointsEarned: number = 0;
  maxPoints = 400;
  userId: string = ''; // Replace with actual user ID from authentication

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.validateToken().subscribe(
      (resp) => {
        this.userId = resp.user.id;
        this.shuffleCards();
      },
      (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']);
      }
    );
  }

  shuffleCards() {
    this.cards = this.cards.sort(() => Math.random() - 0.6);
  }

  flipCard(card: any) {
    if (card.isFlipped || this.flippedCards.length === 2) {
      return;
    }

    card.isFlipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    const [firstCard, secondCard] = this.flippedCards;

    if (firstCard.value === secondCard.value) {
      this.matchedCards.push(firstCard, secondCard);
      this.awardPoints(20);
      this.message = '✅ Match Found!';
    } else {
      this.message = '❌ No Match! Try again.';
      setTimeout(() => {
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
        this.flippedCards = [];
      }, 1000);
    }

    if (this.matchedCards.length === this.cards.length) {
      this.message = '🎉 You win!';
    }
  }

  awardPoints(pointsToAward: number) {
    this.authService.getUserPoints().subscribe((currentPoints) => {
      const remaining = this.maxPoints - currentPoints;
      // if (remaining <= 0) {
      //   this.message = '⚠️ Daily limit reached';
      //   return;
      // }

      const finalAward = Math.min(pointsToAward, remaining);
      this.authService.addPoints(finalAward).subscribe(
        (resp) => {
          this.message = `✅ Points awarded: ${finalAward}`;
        },
        (error) => {
          console.error('Error awarding points', error);
        }
      );
    });
  }
}
