import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../Services/authService';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup | any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        terms: [false, [Validators.requiredTrue]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup | any) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      if (formData.email === 'mmusadar@gmail.com') {
        this.authService
          .signUpAdmin({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: 'Admin',
          })
          .subscribe(
            (response) => {
              console.log('Signup successful', response);
              alert('Signup successful!');
              this.router.navigate(['/login']);
            },
            (error) => {
              console.error('Signup failed', error);
              alert(error.error.message || 'Signup failed');
            }
          );
      } else {
        this.authService
          .signUp({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: 'User',
          })
          .subscribe(
            (response) => {
              console.log('Signup successful', response);
              alert('Signup successful!');
              this.router.navigate(['/login']);
            },
            (error) => {
              console.error('Signup failed', error);
              alert(error.error.message || 'Signup failed');
            }
          );
      }
    }
  }
}
