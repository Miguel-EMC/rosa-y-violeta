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
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';

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
    providers: [DatePipe]
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
        private _router: Router,
        private datePipe: DatePipe,

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



    exportOrderPdf(order: any): void {
        // Create temporary container for invoice
        const invoiceContainer = document.createElement('div');
        invoiceContainer.style.position = 'absolute';
        invoiceContainer.style.left = '-9999px';
        invoiceContainer.style.top = '-9999px';

        // Generate current date for filename
        const currentDate = this.datePipe.transform(new Date(), 'yyyyMMdd');
        const fileName = `orden${order.id}_${this.client.full_name.replace(/\s+/g, '_')}_${currentDate}.pdf`;

        // Create invoice HTML content with modern compact design in pink colors
        invoiceContainer.innerHTML = `
    <div style="width: 800px; font-family: 'Helvetica', Arial, sans-serif; color: #334155; background: #fff; position: relative;">
        <!-- Modern header with pink gradient -->
        <div style="background: linear-gradient(to right, #ec4899, #be185d); padding: 20px; color: white; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0;">
            <!-- Company Logo -->
            <div style="display: flex; align-items: center;">
                <div style="width: 52px; height: 52px; background-color: white; border-radius: 8px; display: flex; justify-content: center; align-items: center;">
                    <div style="font-size: 14px; font-weight: bold; color: #be185d;">LOGO</div>
                </div>
                <div style="margin-left: 15px;">
                    <div style="font-size: 22px; font-weight: 700;">MI EMPRESA S.A.</div>
                    <div style="font-size: 12px; opacity: 0.8;">info@miempresa.com | +593 123 456 789</div>
                </div>
            </div>

            <!-- Invoice Title -->
            <div>
                <div style="font-size: 28px; font-weight: 800; text-align: right;">FACTURA #${order.id}</div>
                <div style="font-size: 13px; opacity: 0.8; text-align: right;">Fecha: ${this.datePipe.transform(order.created_at, 'dd/MM/yyyy')}</div>
            </div>
        </div>

        <!-- Main Content -->
        <div style="padding: 25px; background-color: white; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
            <!-- Client and Details in two columns -->
            <div style="display: flex; margin-bottom: 25px; gap: 25px;">
                <!-- Client Info -->
                <div style="flex: 1; background-color: #fdf2f8; padding: 15px; border-radius: 8px; border-left: 4px solid #ec4899;">
                    <div style="font-weight: 700; color: #be185d; font-size: 14px; text-transform: uppercase; margin-bottom: 8px;">Cliente</div>
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 5px;">${this.client.full_name}</div>
                    <div style="font-size: 13px; color: #64748b; display: flex; flex-wrap: wrap; gap: 12px;">
                        <div style="display: flex; align-items: center;"><span style="font-weight: 600; margin-right: 4px;">CI:</span> ${this.client.cedula || 'N/A'}</div>
                        <div style="display: flex; align-items: center;"><span style="font-weight: 600; margin-right: 4px;">Tel:</span> ${this.client.cellphone_number || 'N/A'}</div>
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 4px;">${this.client.address || 'Sin dirección'}</div>
                </div>

                <!-- Order Info -->
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="margin-bottom: 10px;">
                        <div style="font-weight: 700; color: #be185d; font-size: 14px; text-transform: uppercase; margin-bottom: 8px;">Resumen</div>
                        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-bottom: 4px;">
                            <span>Fecha de emisión:</span>
                            <span>${this.datePipe.transform(order.created_at, 'dd/MM/yyyy')}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-bottom: 4px;">
                            <span>Vencimiento:</span>
                            <span>${this.datePipe.transform(new Date(new Date(order.created_at).getTime() + 30*24*60*60*1000), 'dd/MM/yyyy')}</span>
                        </div>
                    </div>
                    <div style="background-color: #ec4899; color: white; padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 12px; margin-bottom: 2px;">TOTAL A PAGAR</div>
                        <div style="font-size: 24px; font-weight: 700;">$${order.total_to_pay}</div>
                    </div>
                </div>
            </div>

            <!-- Products Table -->
            <div style="margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px;">
                    <thead>
                        <tr style="background-color: #fdf2f8;">
                            <th style="padding: 10px; text-align: left; border-radius: 6px 0 0 6px; color: #be185d; font-weight: 600;">PRODUCTO</th>
                            <th style="padding: 10px; text-align: right; color: #be185d; font-weight: 600;">PRECIO</th>
                            <th style="padding: 10px; text-align: center; color: #be185d; font-weight: 600;">CANT.</th>
                            <th style="padding: 10px; text-align: right; border-radius: 0 6px 6px 0; color: #be185d; font-weight: 600;">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.products.map((product, index) => `
                            <tr style="border-bottom: 1px solid ${index === order.products.length - 1 ? 'transparent' : '#e2e8f0'};">
                                <td style="padding: 8px 10px; font-weight: 500;">${product.product_name}</td>
                                <td style="padding: 8px 10px; text-align: right;">$${product.unit_price}</td>
                                <td style="padding: 8px 10px; text-align: center;">
                                    <span style="background-color: #fce7f3; color: #be185d; padding: 2px 6px; border-radius: 12px; font-size: 12px;">${product.quantity}</span>
                                </td>
                                <td style="padding: 8px 10px; text-align: right; font-weight: 600;">$${(product.quantity * product.unit_price).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Totals Section -->
            <div style="display: flex; justify-content: flex-end;">
                <div style="width: 250px; background-color: #fdf2f8; border-radius: 8px; padding: 15px; border: 1px solid #fbcfe8;">
                    <div style="display: flex; justify-content: space-between; padding: 5px 0; color: #64748b; font-size: 13px;">
                        <span>SUBTOTAL:</span>
                        <span>$${order.total_price}</span>
                    </div>
                    <div style="height: 1px; background-color: #fbcfe8; margin: 8px 0;"></div>
                    <div style="display: flex; justify-content: space-between; padding: 5px 0; font-weight: 700; color: #be185d;">
                        <span>TOTAL:</span>
                        <span>$${order.total_to_pay}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #fdf2f8; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; border-top: 2px solid #fbcfe8;">
            <div style="color: #be185d; font-weight: 700; margin-bottom: 5px; font-size: 14px;">¡Gracias por su compra!</div>
            <div style="color: #64748b; font-size: 12px;">Mi Empresa S.A. | RUC: 0123456789 | www.miempresa.com</div>
        </div>
    </div>
    `;

        document.body.appendChild(invoiceContainer);

        // Convert the invoice HTML to canvas
        html2canvas(invoiceContainer).then(canvas => {
            // Remove the temporary container
            document.body.removeChild(invoiceContainer);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Calculate dimensions to fit on A4
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add new pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Save the PDF
            pdf.save(fileName);

            this._toastrService.success('Factura exportada con éxito', 'Éxito');
        });
    }

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
                        this._clientsListComponent.selectedClient = null;
                        this._clientsListComponent.loadClients();
                        this._router.navigate(['../'], { relativeTo: this._activatedRoute }).then(() => {
                            this.closeDrawer();
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
