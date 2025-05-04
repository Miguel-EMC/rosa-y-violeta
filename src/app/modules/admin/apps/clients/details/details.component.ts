import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatDrawerToggleResult} from "@angular/material/sidenav";
import {ClientsListComponent} from "../list/list.component";
import {Subject} from "rxjs";
import {OverlayRef} from "@angular/cdk/overlay";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ClientsService} from "../../../../../services/clients.service";
import {MatIconModule} from "@angular/material/icon";
import {NgClass, NgIf} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatRippleModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";


@Component({
    selector: 'clients-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        RouterLink,
        MatIconModule,
        NgIf,
        NgClass,
        MatTooltipModule,
        CommonModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatRippleModule,
        MatSelectModule,
        MatDatepickerModule,
        MatCheckboxModule
    ],
})
export class ClientsDetailsComponent implements OnInit {
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    editMode = false;
    clientForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /*** Variables of details client ***/
    client: any = null;
    orders: any[] = [];

    /*** Variables to Order ***/
    pendingOrders: any[] = [];
    shippedOrders: any[] = [];
    showShipped = false;

    //
    /**
     * Constructor
     */
    constructor(
        private _clientsListComponent: ClientsListComponent,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _elementRef: ElementRef,
        private _clientsService: ClientsService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _toastrService: ToastrService,
        private fb: FormBuilder,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._clientsListComponent.matDrawer.open();
        this._activatedRoute.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this._clientsService.getClientById(id).subscribe(client => {
                    this.client = client;
                    this.initForm();
                    this._changeDetectorRef.markForCheck();
                });
                this._clientsService.getOrdersByClient(id).subscribe(orders => {
                    this.orders = Array.isArray(orders) ? orders : (orders?.results || []);
                    this.pendingOrders = this.orders.filter(o => o.status === 'pending');
                    this.shippedOrders = this.orders.filter(o => o.status === 'shipped' || o.status === 'delivered');
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._clientsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(edit: boolean) {
        this.editMode = edit;
        if (edit) {
            this.initForm();
        }
    }


    confirmRemoveProduct(order: any, product: any, productIndex: number): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar producto',
            message: `¿Estás seguro de que deseas eliminar "${product.product_name}" de esta orden?`,
            actions: {
                confirm: {label: 'Eliminar'},
                cancel: {label: 'Cancelar'}
            }
        });
        confirmation.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                order.products.splice(productIndex, 1);
                order.total_price = order.products.reduce((sum, p) => sum + (Number(p.quantity) * Number(p.unit_price)), 0).toFixed(2);
                order.total_to_pay = order.total_price;
                const payload = {
                    client_id: order.client_id,
                    products: order.products.map(p => ({
                        product_id: p.product_id,
                        quantity: p.quantity,
                        unit_price: p.unit_price
                    })),
                    total_price: order.total_price,
                    status: order.status
                };

                this._clientsService.updateOrdersByClient(order.client_id, payload).subscribe(() => {
                    this._toastrService.success('¡Producto eliminado y orden actualizada!', 'Éxito');
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }

    updateOrderTotals(order: any): void {
        order.total_price = order.products.reduce((sum, p) => sum + p.quantity * p.unit_price, 0);
        order.total_to_pay = order.total_price;
    }

    markOrderAsShipped(order: any): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Marcar como entregada',
            message: '¿Estás seguro de que deseas marcar esta orden como entregada?',
            actions: {
                confirm: {label: 'Sí'},
                cancel: {label: 'No'}
            }
        });

        confirmation.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                order.status = 'shipped';
                this._clientsService.updateOrdersByClient(this.client.id, order).subscribe(() => {
                    this.pendingOrders = this.pendingOrders.filter(o => o.id !== order.id);
                    this.shippedOrders.push(order);
                    this._toastrService.success('¡Orden marcada como entregada!', 'Éxito');
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }

    initForm() {
        this.clientForm = this.fb.group({
            balance: [this.client?.balance || '', []],
            first_name: [this.client?.first_name || '', Validators.required],
            last_name: [this.client?.last_name || '', Validators.required],
            alias: [this.client?.alias || ''],
            cedula: [this.client?.cedula || ''],
            email: [this.client?.email || ''],
            cellphone_number: [this.client?.cellphone_number || ''],
            address: [this.client?.address || '']
        });
    }

    /**
     * Update the contact
     */
    updateContact() {
        if (this.clientForm.invalid) return;
        const updatedData = this.clientForm.value;
        this._clientsService.updateClient(this.client.id, updatedData).subscribe({
            next: (updatedClient) => {
                this.client = updatedClient;
                this.editMode = false;
                this._toastrService.success('Cliente actualizado con éxito', 'Éxito');
                this._changeDetectorRef.markForCheck();
            },
            error: () => {
                this._toastrService.error('Error al actualizar el cliente', 'Error');
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Delete the client
     */
    deleteClient(): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar cliente',
            message: '¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.',
            actions: {
                confirm: {label: 'Eliminar'},
                cancel: {label: 'Cancelar'}
            }
        });

        confirmation.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._clientsService.deleteClient(this.client.id).subscribe({
                    next: () => {
                        this._toastrService.success('Cliente eliminado con éxito', 'Éxito');
                        this.closeDrawer().then(() => {
                            this._clientsListComponent.loadClients()
                        });
                    },
                    error: () => {
                        this._toastrService.error('Error al eliminar el cliente', 'Error');
                    }
                });
            }
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
