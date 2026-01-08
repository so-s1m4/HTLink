import {Component, inject, signal} from '@angular/core';
import {Block} from '@shared/ui/block/block';
import {AuthService} from '@core/services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    Block,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService = inject(AuthService)
  
  // Toggle between passwordless and password login
  loginMethod = signal<'code' | 'password'>('code');
  
  // Loading and feedback states
  isLoading = signal(false);
  codeSent = signal(false);
  errorMessage = signal<string | null>(null);
  
  // Email validation pattern from docs
  emailPattern = /^[a-zA-Z]+\.[a-zA-Z]+@htlstp\.at$/;
  
  // Form for email + code login
  codeLoginForm = new FormGroup({
    email: new FormControl<string>("", [
      Validators.required, 
      Validators.pattern(this.emailPattern)
    ]),
    code: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[0-9]{4}$/)
    ]),
  })
  
  // Form for email + password login
  passwordLoginForm = new FormGroup({
    mail: new FormControl<string>("", [
      Validators.required,
      Validators.pattern(this.emailPattern)
    ]),
    password: new FormControl<string>('', [Validators.required]),
  })

  switchLoginMethod(method: 'code' | 'password') {
    this.loginMethod.set(method);
    this.errorMessage.set(null);
    this.codeSent.set(false);
  }

  async loginWithCode() {
    if (this.codeLoginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      try {
        await this.authService.login(this.codeLoginForm.value as {email:string, code:string});
      } catch (error: any) {
        this.errorMessage.set(error.error?.error || 'Invalid code or email. Please try again.');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.showValidationErrors(this.codeLoginForm);
    }
  }

  async loginWithPassword() {
    if (this.passwordLoginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      try {
        await this.authService.loginWithPassword(this.passwordLoginForm.value as {mail:string, password:string});
      } catch (error: any) {
        this.errorMessage.set(error.error?.error || 'Invalid email or password. Please try again.');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.showValidationErrors(this.passwordLoginForm);
    }
  }

  sendVerificationCode() {
    const email = this.codeLoginForm.get('email')?.value;
    
    if (!email) {
      this.errorMessage.set('Please enter your email address.');
      return;
    }
    
    if (!this.emailPattern.test(email)) {
      this.errorMessage.set('Email must be in format: firstname.lastname@htlstp.at');
      return;
    }
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.authService.askForCode({email}).subscribe({
      next: () => {
        this.codeSent.set(true);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.error || 'Failed to send code. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
  
  private showValidationErrors(form: FormGroup) {
    if (form.get('email')?.hasError('required') || form.get('mail')?.hasError('required')) {
      this.errorMessage.set('Please enter your email address.');
    } else if (form.get('email')?.hasError('pattern') || form.get('mail')?.hasError('pattern')) {
      this.errorMessage.set('Email must be in format: firstname.lastname@htlstp.at');
    } else if (form.get('code')?.hasError('required')) {
      this.errorMessage.set('Please enter the verification code.');
    } else if (form.get('code')?.hasError('pattern')) {
      this.errorMessage.set('Code must be a 4-digit number.');
    } else if (form.get('password')?.hasError('required')) {
      this.errorMessage.set('Please enter your password.');
    }
  }
}
