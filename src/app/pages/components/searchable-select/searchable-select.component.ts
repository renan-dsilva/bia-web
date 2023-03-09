import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { SearchabelSelectOption } from './searchable-select.model';

@Component({
    selector: 'app-searchable-select',
    templateUrl: './searchable-select.component.html',
    styleUrls: ['./searchable-select.component.css']
})
export class SearchableSelectComponent implements OnInit {
    @Input() placeholder: string = 'Selecione';
    @Input() form: FormGroup;
    @Input() data: SearchabelSelectOption[] = [];
    @Input() selectedValues: SearchabelSelectOption[] = [];

    @ViewChild('search') searchTextBox: ElementRef;
    selectFormControl = new FormControl();
    searchTextboxControl = new FormControl();
    filteredOptions: Observable<SearchabelSelectOption[]>;

    constructor(private cdr: ChangeDetectorRef) { }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    ngOnInit() {
        this.filteredOptions = this.searchTextboxControl.valueChanges
            .pipe(
                startWith<string>(''),
                map(name => this._filter(name))
            );
    }

    /**
     * Used to filter data based on search input 
     */
    private _filter(name: string): SearchabelSelectOption[] {
        const filterValue = name.toLowerCase();
        // Set selected values to retain the selected checkbox state 
        this.setSelectedValues();
        this.selectFormControl.setValue(this.selectedValues);
        let filteredList = this.data.filter(option => option.title.toLowerCase().indexOf(filterValue) === 0);
        return filteredList;
    }

    /**
     * Remove from selected values based on uncheck
     */
    selectionChange(event) {
        if (event.isUserInput && event.source.selected == false) {
            let index = this.findWithAttr(this.selectedValues, 'value', event.source.value.value);
            if (index >= 0) {
                this.selectedValues.splice(index, 1);
            }
        }
    }

    openedChange(e) {
        // Set search textbox value as empty while opening selectbox 
        this.searchTextboxControl.patchValue('');
        // Focus to search textbox while clicking on selectbox
        if (e == true) {
            this.searchTextBox.nativeElement.focus();
        }
    }

    /**
     * Clearing search textbox value 
     */
    clearSearch(event) {
        event.stopPropagation();
        this.searchTextboxControl.patchValue('');
    }

    /**
     * Set selected values to retain the state 
     */
    setSelectedValues() {
        this.selectedValues = this.selectedValues ? this.selectedValues : [];
        if (this.selectFormControl.value && this.selectFormControl.value.length > 0) {
            this.selectFormControl.value.forEach((e) => {
                if (this.findWithAttr(this.selectedValues, 'value', e.value) == -1) {
                    this.selectedValues.push(e);
                }
            });
        }
    }

    findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }

        return -1;
    }

    compareObjects(o1: any, o2: any) {
        if (o1.value == o2.value)
            return true;
        else
            return false
    }
}
