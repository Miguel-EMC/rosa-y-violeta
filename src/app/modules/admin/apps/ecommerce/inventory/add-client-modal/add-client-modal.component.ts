import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-add-client-modal',
    templateUrl: './add-client-modal.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf]
})
export class AddClientModalComponent {
    @Output() cancel = new EventEmitter<void>();
    @Output() add = new EventEmitter<any>();
    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            cedula: [''],
            alias: [''],
            address: [''],
            balance: ['']
        });
    }

    onCancel() {
        this.cancel.emit();
    }

    onAdd() {
        if (this.form.valid) {
            this.add.emit(this.form.value);
        }
    }
}
