import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class ComponentsModule { }
