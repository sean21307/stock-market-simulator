import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

function confirmPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (!confirmPassword) return null;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      control.get('confirmPassword')?.setErrors(null);
      return null;
    }
  };
}

@Component({
  selector: 'app-auth',
  standalone: true, // ✅ Standalone component
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [CommonModule, ReactiveFormsModule] // ✅ Import ReactiveFormsModule
})
export class AuthComponent {
  isLogin = true; // Toggle between login & signup
  authForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, {validators: confirmPasswordValidator()});
  }

  get email() {
    return this.authForm.get('email');
  }

  get emailInvalid() {
    return this.email?.invalid && (this.email?.dirty || this.email?.touched)
  }

  get password() {
    return this.authForm.get('password');
  }

  get passwordInvalid() {
    return this.password?.invalid && (this.password?.dirty || this.password?.touched)
  }

  get confirmPassword() {
    return this.authForm.get('confirmPassword');
  }

  get confirmPasswordInvalid() {
    return this.confirmPassword?.invalid && (this.confirmPassword?.dirty || this.confirmPassword?.touched)
  }

  toggleAuth() {
    this.isLogin = !this.isLogin;

    if (this.isLogin) {
      this.authForm.get('confirmPassword')?.clearValidators();
      this.authForm.get('confirmPassword')?.updateValueAndValidity();
    } else {
      this.authForm.get('confirmPassword')?.setValidators([Validators.required]);
      this.authForm.get('confirmPassword')?.updateValueAndValidity();
    }

    this.authForm.reset();
  }

  onSubmit() {
    if (this.authForm.invalid) return console.log("invalid");

    const { email, password, confirmPassword } = this.authForm.value;

    if (!this.isLogin && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (this.isLogin) {
      console.log('Logging in:', { email, password });
    } else {
      console.log('Signing up:', { email, password });
    }
  }
}
