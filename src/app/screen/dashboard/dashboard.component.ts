import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/authService';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        console.log('Token is valid', response);
      },
      error: (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']);
      },
    });
  }
}
