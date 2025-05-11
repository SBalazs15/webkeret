import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.loginError = null;

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.signIn(username, password)
        .then((userCredential) => {
          console.log('Login succesful',userCredential.user);
          this.authService.updateLoginStatus(true);
          this.router.navigateByUrl('/home');
        })
        .catch((error) => {
          console.error('Login error:', error);

          switch (error.code){
            case 'auth/invalid-email':
              this.loginError='Ilyen email-el nem létezik felhasználó';
              break;
            case 'auth/invalid-credential':
              this.loginError='Hibás jelszó';
              break;
            default:
              this.loginError='Autentikációs hiba. Próbáld újra később';
          }
        });
    }
  }


  onRegister() {
    this.router.navigate(['/register']);
  }
}
