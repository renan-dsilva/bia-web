import { Component, OnInit } from '@angular/core';
import { SupportProvider } from '../support.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Support } from '../support.model';
import { CustomValidator } from 'app/validators/custom.validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from 'app/providers/provider';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/pages/components/dialog/dialog-confirmation.component';

@Component({
    selector: 'app-user-support',
    templateUrl: './support-form.component.html',
    styleUrls: ['./support-form.component.css'],
})
export class SupportFormComponent {
    public support: Support;

    public form: FormGroup;
    public isBusy = false;
    public formTitle: string;
    public buttonTitle: string;

    constructor(
        public provider: SupportProvider,
        private currentRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
    ) {
        this.setUp();
    }

    setUp() {
        this.reactiveForm();
    }

    reactiveForm() {
        let supportId = this.currentRoute.snapshot.paramMap.get('id');
        if (!supportId && this.provider.support) {
            this.populateFromDependencyInjection(this.provider.support);
        } else if (supportId) {
            this.populateFromUrlParam(supportId);
        } else {
            this.populateFromEmpty();
        }
    }

    populateFromUrlParam(supportId: string) {
        this.provider.get(supportId).subscribe((response: any) => {
            this.provider.support = response.data;
            this.populateForm(response.data);
        });
    }

    populateFromDependencyInjection(support: Support) {
        this.populateForm(support);
    }

    populateFromEmpty() {
        this.populateForm();
    }

    populateForm(support: Support = null) {
        this.support = support;
        this.formTitle = 'New Item';
        this.buttonTitle = 'Add';

        var supportId: string;
        var name: string;
        var level: number;
        var phone: string;
        var emails: string;
        var desc: string;
        var status = 'ACTIVATED';
        if (support) {
            this.formTitle = support.name;
            this.buttonTitle = 'Update';
            supportId = support._id;
            name = support.name;
            level = support.level
            desc = support.desc
            phone = support.phones.length > 0 ? support.phones[0] : '';
            emails = support.emails.length > 0 ? support.emails[0] : '';
            status = support.status;
        }

        this.form = this.fb.group({
            _id: [supportId],
            name: [name, Validators.compose([
                Validators.required,
            ])],
            level: [level, Validators.compose([
                Validators.required,
            ])],
            phone: [phone, Validators.required],
            emails: [emails, Validators.compose([
                Validators.required,
                CustomValidator.EmailValidator
            ])],
            desc: [desc, Validators.required],
            status: [status == 'ACTIVATED'],
        });
    }

    save() {
        if (this.form.invalid) {
            this.snackBar.open('Oops, some information is missing', '', { duration: 5000, panelClass: ['alert', 'alert-primary'] });
            return;
        }

        this.isBusy = true;
        this.snackBar.open('Loading...', '', { panelClass: ['alert', 'alert-warning'] });

        var support: Support = this.form.value;
        support.status = this.form.get('status').value ? 'ACTIVATED' : 'BLOCKED';

        var _support: Support = this.form.value;
        _support.emails = [this.form.get('emails').value];

        _support.phones = [];
        if (this.form.get('phone').value != '') {
            _support.phones.push(this.form.get('phone').value);
        }

        console.log(support)
        this.provider
            .save(support)
            .subscribe((response: any) => {
                this.isBusy = false;
                let res = response as ApiResponse
                let item: Support = res.data

                if (res.success) {
                    this.router.navigate(['/support-form', item._id]);
                    console.log(res)
                    this.snackBar.open(res.message, '', { duration: 5000, panelClass: ['alert', 'alert-success'] });
                } else {
                    this.snackBar.open(res.message, 'Close', { panelClass: ['alert', 'alert-danger'] });
                }
            },
                (err) => {
                    this.isBusy = false;
                    throw (err);
                });
    }

    delete(support: Support) {
        if (support) {

            let dialogRef = this.dialog.open(DialogConfirmationComponent, {
                data: {
                    title: 'Delete',
                    message: 'Are you sure?'
                }
            });

            dialogRef.afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    this.removeFromServer(support);
                }
            });
        }
    }

    removeFromServer(support: Support) {
        this.isBusy = true;
        this.snackBar.open('Loading...', '', { panelClass: ['alert', 'alert-warning'] });

        this.provider.delete(support).subscribe((response: any) => {
            let res = response as ApiResponse;
            this.isBusy = false;

            if (res.success) {
                this.router.navigate(['/support-list']);
            } else {
                this.snackBar.open(res.message, 'Close', { panelClass: ['alert', 'alert-danger'] });
            }
        });
    }

    clearFormData() {
        this.provider.support = null;
        this.router.navigate(['/support-form']);
    }
}
