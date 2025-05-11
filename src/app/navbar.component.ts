import { Component, inject, signal, WritableSignal } from '@angular/core'; // <- fontos!
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <a class="navbar-brand" routerLink="/">BC</a>
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link" routerLink="/build">Konfigurátor</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/compare">Összehasonlító</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/saved">Mentett konfigurációk</a>
        </li>
        <li class="nav-item" *ngIf="isLoggedIn()">
          <a class="nav-link" routerLink="/profile">Profil</a>
        </li>
      </ul>

      <ul class="navbar-nav ms-auto">
        <li>
          <a class="nav-link" style="margin-right: 20px;" *ngIf="isLoggedIn()" routerLink="/admin">Admin</a>
        </li>
        <li class="nav-item" *ngIf="!isLoggedIn()">
          <a class="btn btn-outline-light" routerLink="/login">Bejelentkezés</a>
        </li>
        <li class="nav-item" *ngIf="isLoggedIn()">
          <button class="btn btn-outline-light" (click)="logout()">Kijelentkezés</button>
        </li>
      </ul>
    </nav>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);
  user: WritableSignal<User | null> = signal<User | null>(null); // <- most már módosítható

  constructor() {
    this.authService.isLoggedIn().subscribe((u: User | null) => this.user.set(u));
  }

  isLoggedIn(): boolean {
    return this.user() !== null;
  }

  logout(): void {
    this.authService.singOut();
  }
}
