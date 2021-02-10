import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from '../core/core.module';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordComponent } from './components/password/password.component';
import { LayoutComponent } from './components/layout/layout.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, PasswordComponent, LayoutComponent],
  exports: [LoginComponent, RegisterComponent, PasswordComponent],
  imports: [CommonModule, AuthRoutingModule, CoreModule],
})
export class AuthModule {}
