import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../Services/authService';
import { LoaderComponent } from '../screen/Extra-Screens/loader/loader.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const formData = this.loginForm.value;
      if (formData.email === 'mmusadar@gmail.com') {
        this.authService.loginAdmin(formData).subscribe(
          (response) => {
            console.log('Login successful', response);
            localStorage.setItem('token', response.token);
            this.router.navigate(['/home']);
          },
          (error) => {
            this.loading = false;
            console.error('Login failed', error);
            alert(error.error.message);
          }
        );
      } else {
        this.authService.login(formData).subscribe(
          (response) => {
            this.loading = true;
            console.log('Login successful', response);
            localStorage.setItem('token', response.token);
            // const token = localStorage.getItem('token');
            // console.log('token from storage', token);
            this.router.navigate(['/home']);
          },
          (error) => {
            this.loading = false;
            console.error('Login failed', error);
            alert(error.error.message);
          }
        );
      }
    }
  }
}
