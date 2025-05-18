import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { ExplorersService, Category } from '../explorers.service';
import { ExplorersListComponent } from '../list/list.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector       : 'categoria-form',
    templateUrl    : './categoria-form.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
    ],
})
export class CategoriaFormComponent implements OnInit {

    categoriaForm: UntypedFormGroup;
    categoria: Category;
    modoEdicion: boolean = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _explorersListComponent: ExplorersListComponent,
        private _explorersService: ExplorersService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _toastrService: ToastrService
    ) {}

    ngOnInit(): void {
        this._explorersListComponent.matDrawer.open();
        this.categoriaForm = this._formBuilder.group({
            name: ['', [Validators.required]]
        });
        const categoriaId = this._activatedRoute.snapshot.paramMap.get('id');
        if (categoriaId) {
            this.modoEdicion = true;
            this._explorersService.getCategoryById(+categoriaId).subscribe({
                next: (categoria) => {
                    this.categoria = categoria;

                    this.categoriaForm.patchValue({
                        name: categoria.name
                    });

                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    this._toastrService.error('Error al cargar la categoría', 'Error');
                    this.cerrarDrawer();
                }
            });
        }
    }

    guardarCategoria(): void {
        if (this.categoriaForm.invalid) {
            return;
        }

        this.categoriaForm.disable();

        const categoria = this.categoriaForm.getRawValue();

        if (this.modoEdicion) {
            this._explorersService.updateCategory(this.categoria.id, categoria).subscribe({
                next: () => {
                    this.categoriaForm.enable();
                    this._toastrService.success('Categoría actualizada correctamente', 'Éxito');
                    this._explorersListComponent.cargarCategorias();
                    this.cerrarDrawer();
                },
                error: () => {
                    this.categoriaForm.enable();
                    this._toastrService.error('Error al actualizar la categoría', 'Error');
                    this._changeDetectorRef.markForCheck();
                }
            });
        } else {
            this._explorersService.createCategory(categoria).subscribe({
                next: () => {
                    this.categoriaForm.enable();
                    this._toastrService.success('Categoría creada correctamente', 'Éxito');
                    this._explorersListComponent.cargarCategorias();
                    this.cerrarDrawer();
                },
                error: () => {
                    this.categoriaForm.enable();
                    this._toastrService.error('Error al crear la categoría', 'Error');
                    this._changeDetectorRef.markForCheck();
                }
            });
        }
    }

    cerrarDrawer(): Promise<MatDrawerToggleResult> {
        this._router.navigate(['/apps/explorer'], { relativeTo: this._activatedRoute });
        return this._explorersListComponent.matDrawer.close();
    }
}
