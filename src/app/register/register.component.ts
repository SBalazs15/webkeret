import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import {AuthService} from '../services/auth.service';


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
  signUpError= '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
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
    if (this.registerForm.valid) {

      if(this.passwordMismatch){
        this.signUpError='A jelszavak nem egyeznek';
        return;
      }


      const formValue = this.registerForm.value;

      const userData: Partial<User> = {
        username: formValue.username,
        email: formValue.email,
        name: formValue.name,
        birthDate: formValue.dob ? formValue.dob.toISOString().split('T')[0] : null,
        admin: '0',
      }

      const email = this.registerForm.get('email')?.value;
      const pw = this.registerForm.get('password')?.value;

      this.authService.signUp(email, pw, userData)
        .then(userCredential => {
          console.log('Sikeres regisztráció: ', userCredential.user);
          this.authService.updateLoginStatus(true);
          this.router.navigateByUrl('/home');
        })
        .catch(error => {
          console.error('Regisztrációs hiba: ',error);
          switch (error.code) {
            case 'auth/email-already-in-use':
              this.signUpError='Az az email már használatban van';
              break;
            case 'auth/invalid-email':
              this.signUpError='Érvénytelen email';
              break;
            case 'auth/weak-password':
              this.signUpError='Túl gyenge jelszó, legalább 6 karakter kell, hogy legyen';
              break;
            default:
              this.signUpError='Hiba lépett fel a regisztráció során. Próbáld újra később';
          }
        });
    }
    else{
      this.signUpError = 'Javítsd a hibákat először';
      return;
    }

  }

  back():void{
    this.router.navigate(['/login']);
  }
}
