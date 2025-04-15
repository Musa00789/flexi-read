import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/authService';
import {
  loadStripe,
  Stripe,
  StripeCardElement,
  StripeElements,
} from '@stripe/stripe-js';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';

@Component({
  selector: 'app-top-up-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './top-up-account.component.html',
  styleUrl: './top-up-account.component.css',
})
export class TopUpAccountComponent implements OnInit {
  topupForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  userId = '';
  stripe!: Stripe | null;
  elements!: StripeElements;
  card!: StripeCardElement;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.authService.validateToken().subscribe({
      next: (resp) => (this.userId = resp.user.id),
      error: () => this.router.navigate(['/login']),
    });

    this.topupForm = this.fb.group({
      cardholderName: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
    });

    this.stripe = await loadStripe(
      'pk_test_51Qmx7ZDw4CiChweonZ693r0BWP2ODTG0rZlq8RuJR1vJwpZxVfGCVhvICxMU5fLdvyK04YDLhhGJNzY6V7E7nZCF00s3uqO3XG'
    );
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    }
  }

  async submitTopup(): Promise<void> {
    if (!this.topupForm.valid || !this.stripe || !this.card) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { token, error } = await this.stripe.createToken(this.card, {
      name: this.topupForm.value.cardholderName,
    });

    if (error) {
      this.errorMessage = error.message || 'Card validation failed.';
      this.loading = false;
      return;
    }

    this.authService.doPayment(this.topupForm.value.amount).subscribe({
      next: (res) => {
        this.successMessage = 'Payment successful!';
        this.topupForm.reset();
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Payment failed.';
      },
      complete: () => {
        this.loading = false;
        this.card.clear();
        this.elements.getElement('card')?.clear();
        this.router.navigate(['/profile']);
      },
    });
  }
}
