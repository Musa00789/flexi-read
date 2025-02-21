import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../Component/Home/footer/footer.component';
import { HeaderComponent } from '../../../Component/Home/header/header.component';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/authService';

@Component({
  selector: 'app-become-a-writer',
  imports: [FooterComponent, HeaderComponent, FormsModule, CommonModule],
  templateUrl: './become-a-writer.component.html',
  styleUrl: './become-a-writer.component.css',
})
export class BecomeAWriterComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  user: any;

  ngOnInit(): void {
    this.authService.validateToken().subscribe(
      (response) => {
        this.authService.getUser(response.user.id).subscribe(
          (resp) => {
            this.user = resp.user;
          },
          (error) => {
            console.log('Error fetching user. Error is :' + error);
          }
        );
      },
      (error) => {
        console.log('Failed to validate token.');
        this.router.navigate(['/login']);
      }
    );
  }

  agreed: boolean = false;
  isTransitioning: boolean = false;

  onAgreementChange() {
    console.log('User agreed:', this.agreed);
  }

  startTransition() {
    this.isTransitioning = true;
    this.user.role = 'Author';
    this.authService.changeRole().subscribe(
      (response) => {
        this.router.navigate(['/become-a-writer']);
      },
      (error) => {
        console.log('Error changing role', error);
      }
    );
    setTimeout(() => {
      this.router.navigate(['/view/sell-a-book']);
    }, 3000);
  }
}
