// client/src/app/components/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  
  // Common dietary preferences
  dietaryPreferences: string[] = [
    'Vegetarian', 
    'Vegan', 
    'Gluten-Free', 
    'Dairy-Free',
    'Keto', 
    'Paleo'
  ];
  
  // Common allergies
  allergies: string[] = [
    'Nuts', 
    'Peanuts', 
    'Shellfish', 
    'Dairy', 
    'Eggs', 
    'Wheat',
    'Soy', 
    'Fish'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      dietaryPreferences: [[]],
      allergies: [[]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      return null;
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Remove confirmPassword from the data sent to the API
    const { confirmPassword, ...userData } = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.msg || 'Registration failed. Please try again.';
      }
    });
  }
}