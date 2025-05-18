import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'BuildCompare';
}
