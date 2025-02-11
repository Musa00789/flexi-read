import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../Component/Home/header/header.component';
import { FooterComponent } from '../../../Component/Home/footer/footer.component';

@Component({
  selector: 'app-coming-soon',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.css',
})
export class ComingSoonComponent implements OnInit {
  launchDate: Date = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
  isPlaying = false;
  audio = new Audio('music.mp3');

  constructor() {}

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const timeLeft = this.launchDate.getTime() - now;

      if (timeLeft <= 0) {
        countdownElement.innerText = 'Launching Now!';
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      countdownElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    setInterval(updateCountdown, 1000);
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.loop = true;
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }
}
