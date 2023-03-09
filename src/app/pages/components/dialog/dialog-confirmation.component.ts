import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData {
    title: string;
    message: string;
}

@Component({
    templateUrl: 'dialog-confirmation-component.html',
})
export class DialogConfirmationComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}