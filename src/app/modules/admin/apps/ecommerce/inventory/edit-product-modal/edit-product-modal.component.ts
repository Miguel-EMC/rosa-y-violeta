import {Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ProductsService, Product } from 'app/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-edit-product-modal',
    templateUrl: './edit-product-modal.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf]
})
export class EditProductModalComponent implements OnInit {
    @Input() productId: number;
    @Output() close = new EventEmitter<void>();
    @Output() updated = new EventEmitter<Product>();
    form: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private productsService: ProductsService,
        private toastr: ToastrService,
        private _fuseConfirmationService: FuseConfirmationService,
        private dialogRef: MatDialogRef<EditProductModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.productId = data.productId;
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', Validators.required],
            unit_price: ['', [Validators.required, Validators.min(0)]],
            stock: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
            sku: [''],
            wholesale_price: ['', [Validators.min(0)]],
            wholesale_min_quantity: ['', [Validators.min(0), Validators.pattern('^[0-9]+$')]],
        });

        this.loading = true;
        this.productsService.getProductById(this.productId).subscribe({
            next: (product: Product) => {
                this.form.patchValue(product);
                this.loading = false;
            },
            error: () => {
                this.toastr.error('No se pudo cargar el producto', 'Error');
                this.loading = false;
                this.close.emit();
            }
        });
    }

    onCancel() {
        const confirm = this._fuseConfirmationService.open({
            title: '¿Seguro que quieres cancelar?',
            message: 'Se perderán los cambios realizados.',
            actions: { confirm: { label: 'Sí, cancelar' }, cancel: { label: 'No' } }
        });
        confirm.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this.dialogRef.close();
            }
        });
    }

    onEdit() {
        if (this.form.invalid) {
            this.toastr.warning('Por favor, complete los campos obligatorios correctamente.', 'Advertencia');
            this.form.markAllAsTouched();
            return;
        }
        this.loading = true;
        this.productsService.editProduct(this.productId, this.form.value).subscribe({
            next: (updatedProduct) => {
                this.toastr.success('Producto editado con éxito', 'Éxito');
                this.dialogRef.close(updatedProduct);
            },
            error: () => {
                this.toastr.error('Error al editar el producto', 'Error');
                this.loading = false;
            }
        });
    }

    ngAfterViewInit() {
        this._changeDetectorRef.detectChanges();
    }
}
