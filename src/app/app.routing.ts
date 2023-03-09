import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout.component';

/** BIA */
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { AuthService } from './services/auth.service';
/** BIA */

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthService],
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: {
      title: 'Sair'
    }
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthService],
    children: [{
      path: '',
      canActivate: [AuthService],
      loadChildren: './layouts/admin-layout.module#AdminLayoutModule'
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
