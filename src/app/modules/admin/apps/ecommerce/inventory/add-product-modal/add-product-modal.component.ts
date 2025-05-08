import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {NgIf} from "@angular/common";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-product-modal',
    templateUrl: './add-product-modal.component.html',
    standalone: true,
    imports: [ReactiveFormsModule,NgIf]
})
export class AddProductModalComponent {
    @Output() cancel = new EventEmitter<void>();
    @Output() add = new EventEmitter<any>();
    form: FormGroup;

    constructor(private fb: FormBuilder,
                private dialogRef: MatDialogRef<AddProductModalComponent>
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            unit_price: ['', [Validators.required, Validators.min(0)]],
            stock: [
                '',
                [
                    Validators.required,
                    Validators.min(0),
                    Validators.pattern('^[0-9]+$')
                ]
            ],
            sku: [''],
            wholesale_price: ['', [Validators.min(0)]]
        });
    }

    onCancel() {
        this.dialogRef.close();
    }

    onAdd() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }
}
