import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


// Custom Validator for Confirm Password Matching
function confirmPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    // Only run password match check if both values exist.
    if (confirmPassword === null || confirmPassword === undefined || confirmPassword === '') {
      return null;
    }
    return password !== confirmPassword ? { passwordMismatch: true } : null;
  };
}

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AuthComponent {
  isLogin = true;
  authForm!: FormGroup; // non-null assertion

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.createForm();
  }

  private createForm() {
    this.authForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        email: [''],
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['']
      },
      { validators: confirmPasswordValidator() }
    );
  }

  get username() {
    return this.authForm.get('username');
  }
  get email() {
    return this.authForm.get('email');
  }
  get password() {
    return this.authForm.get('password');
  }
  get confirmPassword() {
    return this.authForm.get('confirmPassword');
  }

  get usernameInvalid() {
    const control = this.authForm.get('username');
    return control && control.invalid && (control.dirty || control.touched);
  }
  get emailInvalid() {
    const control = this.authForm.get('email');
    return control && control.invalid && (control.dirty || control.touched);
  }
  get passwordInvalid() {
    const control = this.authForm.get('password');
    return control && control.invalid && (control.dirty || control.touched);
  }
  get confirmPasswordInvalid() {
    const control = this.authForm.get('confirmPassword');
    return control && control.invalid && (control.dirty || control.touched);
  }

  toggleAuth() {
    this.isLogin = !this.isLogin;

    if (this.isLogin) {
      // In login mode, email and confirmPassword are not required
      this.email?.clearValidators();
      this.confirmPassword?.clearValidators();
    } else {
      // In signup mode, email and confirmPassword become required
      this.email?.setValidators([Validators.required, Validators.email]);
      this.confirmPassword?.setValidators([Validators.required]);
    }

    this.email?.updateValueAndValidity();
    this.confirmPassword?.updateValueAndValidity();
    this.authForm.reset();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      console.log('Form is invalid');
      // (Optional) log current errors for debugging:
      console.log(this.authForm.errors, this.authForm.value);
      return;
    }

    const { username, email, password, confirmPassword } = this.authForm.value;

    if (!this.isLogin && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (this.isLogin) {
      console.log('Logging in:', { username, password });
      this.authService.loginUser({ username, password }).subscribe(
        (response) => {

          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('username', username);

          console.log('Login successful');
          this.router.navigate(['/profile']);
        },
        (error) => {
          // TODO: display incorrect credentials notification
          console.error('Login failed', error);
        }
      );
    } else {
      console.log('Signing up:', { username, email, password });
      this.authService.registerUser({ username, email, password }).subscribe(
        (response) => {
          console.log('Registration successful', response);
          alert('Registration successful!');
          this.toggleAuth();
        },
        (error) => {
          alert('Registration failed. Check console for errors.');
          console.error('Registration failed', error);
        }
      );
    }
  }
}
