import {Component, EventEmitter, Output, AfterViewInit, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { ExplorersService, Brand, Category } from 'app/modules/admin/apps/explorers/explorers.service';
import { map, Observable, of, startWith } from "rxjs";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-product-modal',
    templateUrl: './add-product-modal.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, AsyncPipe, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatOptionModule, NgForOf]
})
export class AddProductModalComponent implements OnInit, AfterViewInit {
    @Output() cancel = new EventEmitter<void>();
    @Output() add = new EventEmitter<any>();
    form: FormGroup;

    brands: Brand[] = [];
    categories: Category[] = [];
    filteredBrands: Observable<Brand[]> = of([]);
    filteredCategories: Observable<Category[]> = of([]);

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddProductModalComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private explorersService: ExplorersService,
        private toastr: ToastrService
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
            wholesale_price: ['', [Validators.min(0)]],
            wholesale_min_quantity: ['', [Validators.min(0), Validators.pattern('^[0-9]+$')]],
            brand: [null],
            category: [null]
        });
    }

    ngOnInit() {
        this.loadBrandsAndCategories();
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
        this.dialogRef.close();
    }

    onAdd() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        } else {
            this.form.markAllAsTouched();
            this.toastr.warning('Por favor, complete los campos obligatorios correctamente', 'Advertencia');
        }
    }

    ngAfterViewInit() {
        this._changeDetectorRef.detectChanges();
    }
}
