import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryService } from 'app/modules/admin/apps/ecommerce/inventory/inventory.service';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { ProductsService, Product } from 'app/services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService, ToastNoAnimation } from 'ngx-toastr';
import { EditProductComponent } from '../edit-product/edit-product.component';
import {AddProductModalComponent} from "../add-product-modal/add-product-modal.component";
import {EditProductModalComponent} from "../edit-product-modal/edit-product-modal.component";
@Component({
    selector       : 'inventory-list',
    templateUrl    : './inventory.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `,
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports: [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe, ToastNoAnimation, EditProductComponent, AddProductModalComponent, EditProductModalComponent],
})
export class InventoryListComponent implements OnInit, AfterViewInit, OnDestroy
{


    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    products$: Observable<InventoryProduct[]>;
    externalProducts: Product[] = [];


    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: UntypedFormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    isModalVisible: boolean = false;
    productId: number = 0;
    nameProduct: string = '';
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /*** Pagination ***/
    totalProducts = 0;
    pageSize = 10;
    pageIndex = 0;

    /*** Variables to search ***/
    searchSku: string = '';
    searchName: string = '';

    /*** Variables to add new product ***/
    showAddProductModal = false;

    /*** Variables to edit product ***/
    showEditProductModal = false;
    editProductId: number | null = null;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _inventoryService: InventoryService,
        private _productsService: ProductsService,
        private dialog: MatDialog,
        private toastr: ToastrService,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the selected product form
        this.selectedProductForm = this._formBuilder.group({
            id               : [''],
            category         : [''],
            name             : ['', [Validators.required]],
            description      : [''],
            tags             : [[]],
            sku              : [''],
            barcode          : [''],
            brand            : [''],
            vendor           : [''],
            stock            : [''],
            reserved         : [''],
            cost             : [''],
            basePrice        : [''],
            taxPercent       : [''],
            price            : [''],
            weight           : [''],
            thumbnail        : [''],
            images           : [[]],
            currentImageIndex: [0], // Image index that is currently being viewed
            active           : [false],
        });


        this.searchInputControl.valueChanges
            .pipe(debounceTime(400))
            .subscribe((value) => {
                this.searchName = value;
                this.pageIndex = 0;
                this.searchProducts();
            });

        this.getProducts();
        //Listener para cuando se agregue usuarios a productos
        this._productsService.productsUpdated$.subscribe(() => {
            this.getProducts();
        });


    }

    openModal(id: number, nameProduct: string) : void {
        this.productId = id;
        this.nameProduct = nameProduct;
        this.isModalVisible = true;
        this._changeDetectorRef.markForCheck();
    }

    closeModal() : void{
        if (this.isModalVisible) {
            this.isModalVisible = false;
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedProduct(id: number): void {
        console.log(id);
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Vas a eliminar un producto',
            message: '¿Estás seguro de querer eliminar el producto?',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });

        confirmation.afterClosed().subscribe(result => {
            if ( result === 'confirmed' ) {
                this._productsService.deleteProductById(id)
                    .subscribe({
                        next: (response) => {
                            this.toastr.success('Producto eliminado', 'Alerta');
                            // Aquí imprimes el response
                            console.log('Delete response:', response);
                            this.getProducts();

                            this.closeDetails();
                        },
                        error: (err) => {
                            console.error('Error deleting product:', err);
                            // Opcional: muestra un mensaje de error al usuario
                        }
                    });
            }
        });
    }

    getProducts(): void {
        this._productsService.getProducts(this.pageSize, this.pageIndex * this.pageSize).subscribe({
            next: (response) => {
                this.externalProducts = response.results;
                this.totalProducts = response.count;
                this._changeDetectorRef.markForCheck();
            },
            error: (err) => {
                console.error('Error al obtener productos:', err);
            }
        });
    }

    get totalPages(): number {
        return Math.ceil(this.totalProducts / this.pageSize);
    }

    goToPreviousPage(): void {
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.getProducts();
        }
    }

    goToNextPage(): void {
        if ((this.pageIndex + 1) < this.totalPages) {
            this.pageIndex++;
            if (this.searchName || this.searchSku) {
                this.searchProducts();
            } else {
                this.getProducts();
            }
        } else {
            this.toastr.info('No existen más datos', 'Información');
        }
    }


    searchProducts(): void {
        const body: any = {};
        if (this.searchSku) body.sku = this.searchSku;
        if (this.searchName) body.name = this.searchName;

        this._productsService.searchProducts(body, this.pageSize, this.pageIndex * this.pageSize).subscribe({
            next: (response) => {
                this.externalProducts = response.results;
                this.totalProducts = response.count;
                this._changeDetectorRef.markForCheck();
            },
            error: (err) => {
                this.toastr.error('Error al buscar productos', 'Error');
            }
        });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() =>
                {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() =>
                {
                    this.isLoading = false;
                }),
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------



    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedProduct = null;
    }



    /*** Create product ***/
    onCreateProduct() {
        this.showAddProductModal = true;
    }

    onAddProductModalCancel() {
        const confirm = this._fuseConfirmationService.open({
            title: '¿Seguro que quieres cancelar?',
            message: 'Se perderán los datos ingresados.',
            actions: { confirm: { label: 'Sí, cancelar' }, cancel: { label: 'No' } }
        });
        confirm.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this.showAddProductModal = false;
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    onAddProductModalAdd(productData: any) {
        this.isLoading = true;
        this._productsService.createProduct(productData).subscribe({
            next: () => {
                this.showAddProductModal = false;
                this.isLoading = false;
                this.toastr.success('Producto añadido con éxito', 'Éxito');
                this.getProducts();
                this._changeDetectorRef.detectChanges();
            },
            error: () => {
                this.isLoading = false;
                this.toastr.error('Error al crear el producto', 'Error');
                this._changeDetectorRef.detectChanges();
            }
        });
    }


    /*** Edit product ***/
    openEditProductModal(productId: number) {
        this.editProductId = productId;
        this.showEditProductModal = true;
        this._changeDetectorRef.markForCheck();
    }

    onProductUpdated(updatedProduct: Product) {
        const index = this.externalProducts.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
            this.externalProducts[index] = { ...this.externalProducts[index], ...updatedProduct };
            this._changeDetectorRef.markForCheck();
        }
    }


    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() =>
        {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
