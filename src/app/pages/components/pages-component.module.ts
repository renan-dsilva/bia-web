import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogConfirmationComponent } from './dialog/dialog-confirmation.component';
import { AuthImagePipe } from '../components/auth-image/auth-image.pipe';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatNativeDateModule
    ],
    declarations: [
        SearchableSelectComponent,
        DialogConfirmationComponent,
        AuthImagePipe,
    ],
    exports: [
        SearchableSelectComponent,
        DialogConfirmationComponent,
        AuthImagePipe,
    ]
})
export class PagesComponentsModule { }
