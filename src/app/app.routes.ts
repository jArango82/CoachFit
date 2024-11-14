import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'principal',
    loadComponent: () => import('./components/principal/principal.component').then(m => m.PrincipalComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/iniciologin/iniciologin.component').then(m => m.HomeComponent)
  },
  {
    path: 'grupos',
    loadComponent: () => import('./components/grupos/grupos.component').then(m => m.GroupsComponent)
  },
  { path: '**', redirectTo: '/login' }
];