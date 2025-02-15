import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';  // Import the AuthService

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

  constructor(private fb: FormBuilder, private authService: AuthService) {  // Inject AuthService
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
  
    // Adjust validation logic for confirmPassword based on login/signup toggle
    if (this.isLogin) {
      this.authForm.get('confirmPassword')?.clearValidators();
    } else {
      this.authForm.get('confirmPassword')?.setValidators([Validators.required]);
    }
  
    // Only update validity if the control has been changed
    this.authForm.get('confirmPassword')?.updateValueAndValidity();
  
    // Reset the form values but not the validation state
    this.authForm.reset();
  }
  
  onSubmit() {
    if (this.authForm.invalid) {
      console.log('Form is invalid');
      return;
    }
  
    const { email, password, confirmPassword } = this.authForm.value;
  
    if (!this.isLogin && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    if (this.isLogin) {
      console.log('Logging in:', { email, password });
      this.authService.loginUser({ email, password }).subscribe(
        (response) => {
          localStorage.setItem('access_token', response.access);  // Store JWT
          localStorage.setItem('refresh_token', response.refresh);  // Store JWT
          console.log('Login successful');
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    } else {
      console.log('Signing up:', { email, password });
      this.authService.registerUser({ email, password }).subscribe(
        (response) => {
          console.log('Registration successful', response);
          alert('Registration successful!');
          this.toggleAuth();  // Switch to login form after successful registration
        },
        (error) => {
          console.error('Registration failed', error);
        }
      );
    }
  }
}
  