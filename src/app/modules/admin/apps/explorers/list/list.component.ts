import { CdkDrag, CdkDragHandle, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { DatePipe, DOCUMENT, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { ExplorersService, Brand, Category } from '../explorers.service';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
    selector       : 'explorers-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [MatSidenavModule, RouterOutlet, NgIf, MatButtonModule, MatTooltipModule, MatIconModule, CdkDropList, NgFor, CdkDrag, NgClass, CdkDragPreview, CdkDragHandle, RouterLink, TitleCasePipe, DatePipe, MatProgressSpinnerModule],
})
export class ExplorersListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    drawerMode: 'side' | 'over';
    marcas: Brand[] = [];
    categorias: Category[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _explorersService: ExplorersService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _toastrService: ToastrService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void
    {
        // Cargar marcas y categorías
        this.cargarMarcas();
        this.cargarCategorias();

        // Configurar el drawer
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                this.drawerMode = state.matches ? 'side' : 'over';
                this._changeDetectorRef.markForCheck();
            });

        // Monitor route changes to open the drawer when navigating to detail routes
        this._activatedRoute.children.forEach(child => {
            child.url.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                // If we're on a details route, open the drawer
                if (this._router.url.includes('crear-') || this._router.url.includes('editar-')) {
                    this.matDrawer.open();
                }
                this._changeDetectorRef.markForCheck();
            });
        });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    cargarMarcas(): void
    {
        this._explorersService.getBrands(100, 0)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    this.marcas = response.results;
                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    this._toastrService.error('Error al cargar las marcas', 'Error');
                }
            });
    }

    cargarCategorias(): void
    {
        this._explorersService.getCategories(100, 0)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    this.categorias = response.results;
                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    this._toastrService.error('Error al cargar las categorías', 'Error');
                }
            });
    }

    onBackdropClicked(): void
    {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    crearMarca(): void
    {
        this._router.navigate(['./crear-marca'], {relativeTo: this._activatedRoute})
            .then(() => {
                // Ensure the drawer is opened
                if (!this.matDrawer.opened) {
                    this.matDrawer.open();
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    crearCategoria(): void
    {
        this._router.navigate(['./crear-categoria'], {relativeTo: this._activatedRoute})
            .then(() => {
                // Ensure the drawer is opened
                if (!this.matDrawer.opened) {
                    this.matDrawer.open();
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    editarMarca(marca: Brand): void
    {
        this._router.navigate(['./editar-marca', marca.id], {relativeTo: this._activatedRoute})
            .then(() => {
                // Ensure the drawer is opened
                if (!this.matDrawer.opened) {
                    this.matDrawer.open();
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    editarCategoria(categoria: Category): void
    {
        this._router.navigate(['./editar-categoria', categoria.id], {relativeTo: this._activatedRoute})
            .then(() => {
                // Ensure the drawer is opened
                if (!this.matDrawer.opened) {
                    this.matDrawer.open();
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    eliminarMarca(marca: Brand): void
    {
        const confirmacion = this._fuseConfirmationService.open({
            title  : 'Eliminar marca',
            message: `¿Estás seguro de que quieres eliminar la marca "${marca.name}"? Esta acción no se puede deshacer.`,
            actions: {
                confirm: {
                    label: 'Eliminar'
                },
                cancel: {
                    label: 'Cancelar'
                }
            }
        });

        confirmacion.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._explorersService.deleteBrand(marca.id).subscribe({
                    next: () => {
                        this._toastrService.success('Marca eliminada correctamente', 'Éxito');
                        this.cargarMarcas();
                    },
                    error: () => {
                        this._toastrService.error('Error al eliminar la marca', 'Error');
                    }
                });
            }
        });
    }

    eliminarCategoria(categoria: Category): void
    {
        const confirmacion = this._fuseConfirmationService.open({
            title  : 'Eliminar categoría',
            message: `¿Estás seguro de que quieres eliminar la categoría "${categoria.name}"? Esta acción no se puede deshacer.`,
            actions: {
                confirm: {
                    label: 'Eliminar'
                },
                cancel: {
                    label: 'Cancelar'
                }
            }
        });

        confirmacion.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._explorersService.deleteCategory(categoria.id).subscribe({
                    next: () => {
                        this._toastrService.success('Categoría eliminada correctamente', 'Éxito');
                        this.cargarCategorias();
                    },
                    error: () => {
                        this._toastrService.error('Error al eliminar la categoría', 'Error');
                    }
                });
            }
        });
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
