import { Component, OnInit, NgModule } from '@angular/core';
import { AuthService } from '../../Services/authService';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { HeaderComponent } from '../../Component/Home/header/header.component';

@Component({
  selector: 'app-top-up-account',
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './top-up-account.component.html',
  styleUrl: './top-up-account.component.css',
})
export class TopUpAccountComponent implements OnInit {
  topupForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  userId: String = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.validateToken().subscribe(
      (resp) => {
        console.log('Token is valid');
        this.userId = resp.user.id;
      },
      (err) => {
        console.error('Token validation failed');
        this.router.navigate(['/login']);
      }
    );

    this.topupForm = this.fb.group({
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^(?:\\d{4} ?){3}\\d{4}$')],
      ],
      cardholderName: ['', [Validators.required, Validators.minLength(2)]],
      expiryDate: [
        '',
        [
          Validators.required,
          Validators.pattern('^(19|20)\\d{2}\\/(0[1-9]|1[0-2])$'),
        ],
      ],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      amount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/\D/g, '');
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = formattedValue;
    this.topupForm
      .get('cardNumber')
      ?.setValue(formattedValue, { emitEvent: false });
  }

  submitTopup(): void {
    if (this.topupForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const amount = this.topupForm.value.amount * 4;

    this.authService.addPoints(amount).subscribe({
      next: (response) => {
        this.successMessage = 'Account topped up successfully!';
        this.loading = false;
        this.router.navigate(['/profile']);
        this.topupForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to top up account.';
        this.loading = false;
      },
    });
  }
}
