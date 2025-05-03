import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {NgIf} from "@angular/common";

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

    constructor(private fb: FormBuilder) {
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
        this.cancel.emit();
    }

    onAdd() {
        if (this.form.valid) {
            this.add.emit(this.form.value);
        }
    }
}
