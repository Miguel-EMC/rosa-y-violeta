import {Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import { ProductsService, Product } from 'app/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ExplorersService, Brand, Category } from 'app/modules/admin/apps/explorers/explorers.service';
import {map, Observable, startWith} from "rxjs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";

@Component({
    selector: 'app-edit-product-modal',
    templateUrl: './edit-product-modal.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, MatFormFieldModule, MatAutocompleteModule, AsyncPipe, MatInputModule , NgFor]
})
export class EditProductModalComponent implements OnInit {
    @Input() productId: number;
    @Output() close = new EventEmitter<void>();
    @Output() updated = new EventEmitter<Product>();
    form: FormGroup;
    loading = false;

    brands: Brand[] = [];
    categories: Category[] = [];

    filteredBrands: Observable<Brand[]>;
    filteredCategories: Observable<Category[]>;

    constructor(
        private fb: FormBuilder,
        private productsService: ProductsService,
        private toastr: ToastrService,
        private _fuseConfirmationService: FuseConfirmationService,
        private dialogRef: MatDialogRef<EditProductModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _changeDetectorRef: ChangeDetectorRef,
        private explorersService: ExplorersService,
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
            brand: [null],
            category: [null]
        });

        // Load brands and categories
        this.loadBrandsAndCategories();

        this.filteredBrands = this.form.get('brand').valueChanges.pipe(
            startWith(''),
            map(value => this._filterBrands(value || ''))
        );

        this.filteredCategories = this.form.get('category').valueChanges.pipe(
            startWith(''),
            map(value => this._filterCategories(value || ''))
        );

        this.loading = true;
        this.productsService.getProductById(this.productId).subscribe({
            next: (product: Product) => {
                this.form.patchValue({
                    ...product,
                    brand: product.brand,
                    category: product.category
                });
                this.loading = false;
            },
            error: () => {
                this.toastr.error('No se pudo cargar el producto', 'Error');
                this.loading = false;
                this.close.emit();
            }
        });
    }

    loadBrandsAndCategories(): void {
        this.explorersService.getBrands(100, 0).subscribe({
            next: (response) => {
                this.brands = response.results;
                this.filteredBrands = this.form.get('brand').valueChanges.pipe(
                    startWith(''),
                    map(value => this._filterBrands(value || ''))
                );
                this.form.get('brand').updateValueAndValidity();
                this._changeDetectorRef.markForCheck();
            },
            error: () => {
                this.toastr.error('Error al cargar las marcas', 'Error');
            }
        });

        this.explorersService.getCategories(100, 0).subscribe({
            next: (response) => {
                this.categories = response.results;
                this.filteredCategories = this.form.get('category').valueChanges.pipe(
                    startWith(''),
                    map(value => this._filterCategories(value || ''))
                );
                this.form.get('category').updateValueAndValidity();
                this._changeDetectorRef.markForCheck();
            },
            error: () => {
                this.toastr.error('Error al cargar las categorías', 'Error');
            }
        });
    }

    private _filterBrands(value: string | number): Brand[] {
        if (typeof value === 'number') {
            return this.brands.filter(brand => brand.id === value);
        }
        if (!value || value === '') {
            return this.brands;
        }
        const filterValue = value.toLowerCase();
        return this.brands.filter(brand => brand.name.toLowerCase().includes(filterValue));
    }

    private _filterCategories(value: string | number): Category[] {
        if (typeof value === 'number') {
            return this.categories.filter(category => category.id === value);
        }
        if (!value || value === '') {
            return this.categories;
        }

        const filterValue = value.toLowerCase();
        return this.categories.filter(category => category.name.toLowerCase().includes(filterValue));
    }


    displayBrandFn(brandId: number): string {
        if (!brandId) return '';
        const brand = this.brands.find(b => b.id === brandId);
        return brand ? brand.name : '';
    }

    displayCategoryFn(categoryId: number): string {
        if (!categoryId) return '';
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : '';
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
