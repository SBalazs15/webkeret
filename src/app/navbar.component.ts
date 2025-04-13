import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
        <li class="nav-item" >
          <a class="nav-link" routerLink="/saved">Mentett konfigurációk</a>
        </li>
        <li class="nav-item" > <!--*ngIf="isLoggedIn"-->
          <a class="nav-link" routerLink="/profile">Profil</a>
        </li>
      </ul>

      <ul class="navbar-nav ms-auto">
        <li class="nav-item" *ngIf="!isLoggedIn">
          <a class="btn btn-outline-light" routerLink="/login">Bejelentkezés</a>
        </li>
        <li class="nav-item" *ngIf="isLoggedIn">
          <button class="btn btn-outline-light" (click)="toggleLogin()">Kijelentkezés</button>
        </li>
      </ul>
    </nav>

  `
})
export class NavbarComponent {
  isLoggedIn = false;

  toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }
}
