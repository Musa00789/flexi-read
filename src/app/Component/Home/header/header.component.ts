import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/authService';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  user: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.validateToken().subscribe(
      (response) => {
        this.isLoggedIn = true;
        this.authService.getUser(response.user.id).subscribe((resp) => {
          this.user = resp.user;
        });
      },
      (error) => {
        console.log('Token valition failed.', error);
        this.router.navigate(['/login']);
      }
    );
  }

  becomeSeller() {
    if (this.user.role === 'Reader' || this.user.role === 'Admin') {
      this.router.navigate(['/become-a-writer']);
    } else if (this.user.role === 'Author') {
      this.router.navigate(['/view/sell-a-book']);
    } else {
      this.router.navigate(['comming-soon']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
