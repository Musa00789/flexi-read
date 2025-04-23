import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Services/authService';
import { Router } from '@angular/router';
import { LoaderComponent } from '../screen/Extra-Screens/loader/loader.component';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  loading = false;
  submitted = false;
  message: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.message = this.error = null;

    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.sendPasswordReset(this.forgotForm.value.email).subscribe({
      next: () => {
        this.loading = false;
        this.message =
          'If that email is registered, you will receive reset instructions shortly.';
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to send reset email.';
      },
    });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
