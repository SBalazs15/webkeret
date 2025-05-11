import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BuildComponent } from './build/build.component';
import { CompareComponent } from './compare/compare.component';
import { SavedComponent } from './saved/saved.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {ComponentCompareComponent} from './pages/component-compare/component-compare.component';
import {ConfigCompareComponent} from './pages/config-compare/config-compare.component';
import {AdminComponent} from './admin/admin.component';
import {authGuard, publicGuard} from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'build', component: BuildComponent },
  { path: 'compare', component: CompareComponent },
  { path: 'saved', component: SavedComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [publicGuard]  },
  { path: 'componentCompare', component: ComponentCompareComponent },
  { path: 'configCompare', component: ConfigCompareComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard]  },
  { path: '**', component: HomeComponent }
];

