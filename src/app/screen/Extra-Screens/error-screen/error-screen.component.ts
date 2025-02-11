import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-screen.component.html',
  styleUrls: ['./error-screen.component.css'],
})
export class ErrorScreenComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }
}
