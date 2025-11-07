import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from '../../../shared/button/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Button],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]+$')]),
    userName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9@]+$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmpassword: new FormControl('', [Validators.required])
  });

  passwordsMatch() {
    return (
      this.registerForm.get('password')?.value ===
      this.registerForm.get('confirmpassword')?.value
    );
  }

  isFormInValid() {
    return this.registerForm.invalid || !this.passwordsMatch();
  }

  onSubmit() {
    if (this.registerForm.valid && this.passwordsMatch()) {
      console.log(this.registerForm.value);
      // Add navigation or success logic here
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
