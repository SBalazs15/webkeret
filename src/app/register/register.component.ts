import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../model/user.model';


@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get passwordMismatch(): boolean {
    const pw = this.registerForm.get('password')?.value;
    const cpw = this.registerForm.get('confirmPassword')?.value;
    return pw && cpw && pw !== cpw;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.passwordMismatch) {
      const formValue = this.registerForm.value;

      const newUser = new User(
        formValue.name,
        formValue.username,
        formValue.dob,
        formValue.email,
        formValue.password
      );

      console.log(newUser.toString());
    }
  }

  back():void{
    this.router.navigate(['/login']);
  }
}
