import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ExplorersService, Brand, Category } from '../explorers.service';
import { CategoriaFormComponent } from './categoria-form.component';
import { MarcaFormComponent } from './marca-form.component';
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {NgFor, NgIf} from "@angular/common";

@Component({
    selector: 'explorers-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        RouterLink,
        NgIf,
        NgFor
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorersDetailsComponent implements OnInit {
    categories: Category[] = [];
    brands: Brand[] = [];
    loadingCategories: boolean = false;
    loadingBrands: boolean = false;

    constructor(
        private _explorersService: ExplorersService,
        private _dialog: MatDialog,
        private _toastr: ToastrService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadCategories();
        this.loadBrands();
    }

    loadCategories(): void {
        this.loadingCategories = true;
        this._explorersService.getCategories(100, 0).subscribe({
            next: (response) => {
                this.categories = response.results;
                this.loadingCategories = false;
                this._changeDetectorRef.markForCheck();
            },
            error: () => {
                this._toastr.error('Error al cargar las categorías', 'Error');
                this.loadingCategories = false;
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    loadBrands(): void {
        this.loadingBrands = true;
        this._explorersService.getBrands(100, 0).subscribe({
            next: (response) => {
                this.brands = response.results;
                this.loadingBrands = false;
                this._changeDetectorRef.markForCheck();
            },
            error: () => {
                this._toastr.error('Error al cargar las marcas', 'Error');
                this.loadingBrands = false;
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    openCategoryForm(): void {
        const dialogRef = this._dialog.open(CategoriaFormComponent, {
            width: '400px',
            data: { category: null }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadCategories();
            }
        });
    }

    editCategory(category: Category): void {
        const dialogRef = this._dialog.open(CategoriaFormComponent, {
            width: '400px',
            data: { category }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadCategories();
            }
        });
    }

    deleteCategory(id: number): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar categoría',
            message: '¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.',
            actions: {
                confirm: {
                    label: 'Eliminar'
                },
                cancel: {
                    label: 'Cancelar'
                }
            }
        });

        confirmation.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._explorersService.deleteCategory(id).subscribe({
                    next: () => {
                        this._toastr.success('Categoría eliminada con éxito', 'Éxito');
                        this.loadCategories();
                    },
                    error: () => {
                        this._toastr.error('Error al eliminar la categoría', 'Error');
                    }
                });
            }
        });
    }

    openBrandForm(): void {
        const dialogRef = this._dialog.open(MarcaFormComponent, {
            width: '400px',
            data: { brand: null }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadBrands();
            }
        });
    }

    editBrand(brand: Brand): void {
        const dialogRef = this._dialog.open(MarcaFormComponent, {
            width: '400px',
            data: { brand }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadBrands();
            }
        });
    }

    deleteBrand(id: number): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar marca',
            message: '¿Está seguro de que desea eliminar esta marca? Esta acción no se puede deshacer.',
            actions: {
                confirm: {
                    label: 'Eliminar'
                },
                cancel: {
                    label: 'Cancelar'
                }
            }
        });

        confirmation.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._explorersService.deleteBrand(id).subscribe({
                    next: () => {
                        this._toastr.success('Marca eliminada con éxito', 'Éxito');
                        this.loadBrands();
                    },
                    error: () => {
                        this._toastr.error('Error al eliminar la marca', 'Error');
                    }
                });
            }
        });
    }
}
