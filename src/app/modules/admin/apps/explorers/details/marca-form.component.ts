import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { ExplorersService, Brand } from '../explorers.service';
import { ExplorersListComponent } from '../list/list.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector       : 'marca-form',
    templateUrl    : './marca-form.component.html',
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
export class MarcaFormComponent implements OnInit {

    marcaForm: UntypedFormGroup;
    marca: Brand;
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
        this.marcaForm = this._formBuilder.group({
            name: ['', [Validators.required]]
        });
        const marcaId = this._activatedRoute.snapshot.paramMap.get('id');

        if (marcaId) {
            this.modoEdicion = true;
            this._explorersService.getBrandById(+marcaId).subscribe({
                next: (marca) => {
                    this.marca = marca;
                    this.marcaForm.patchValue({
                        name: marca.name
                    });
                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    this._toastrService.error('Error al cargar la marca', 'Error');
                    this.cerrarDrawer();
                }
            });
        }
    }

    guardarMarca(): void {
        if (this.marcaForm.invalid) {
            return;
        }
        this.marcaForm.disable();
        const marca = this.marcaForm.getRawValue();

        if (this.modoEdicion) {
            this._explorersService.updateBrand(this.marca.id, marca).subscribe({
                next: () => {
                    this.marcaForm.enable();
                    this._toastrService.success('Marca actualizada correctamente', 'Éxito');
                    this._explorersListComponent.cargarMarcas();
                    this.cerrarDrawer();
                },
                error: () => {
                    this.marcaForm.enable();
                    this._toastrService.error('Error al actualizar la marca', 'Error');
                    this._changeDetectorRef.markForCheck();
                }
            });
        } else {
            this._explorersService.createBrand(marca).subscribe({
                next: () => {
                    this.marcaForm.enable();
                    this._toastrService.success('Marca creada correctamente', 'Éxito');
                    this._explorersListComponent.cargarMarcas();
                    this.cerrarDrawer();
                },
                error: () => {
                    this.marcaForm.enable();
                    this._toastrService.error('Error al crear la marca', 'Error');
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
