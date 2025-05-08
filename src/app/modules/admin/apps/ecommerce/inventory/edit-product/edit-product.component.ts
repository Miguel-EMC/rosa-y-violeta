import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {Client, ProductsService} from 'app/services/products.service';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {ToastrService} from 'ngx-toastr';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {ClientsService} from 'app/services/clients.service';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {ViewChild} from '@angular/core';
import {AddClientModalComponent} from "../add-client-modal/add-client-modal.component";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
@Component({
    selector: 'app-edit-product',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        AddClientModalComponent
    ],
    templateUrl: './edit-product.component.html',
    styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() productId: number;
    @Input() nameProduct: string = '';
    @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
    @ViewChild('searchInput') searchInput: any;

    productNum: number = 0;
    stringName: string = '';
    quantity: number = 1;
    listClients: Client[] = [];
    copyListClients: Client[] = [];
    isLoadingClients: boolean = true;
    isLoading: boolean = false;


    /*** Search Clients ***/
    userResults: any[] = [];
    userHasMore = false;
    userLoading = false;
    userSkip = 0;
    userTake = 10;
    lastSearchText = '';
    public searchUserControl: FormControl = new FormControl('');
    productUnitPrice: string = '0.00';
    productStock: number = 0;
    originalProductStock: number = 0;

    /*** Add new client ***/
    showAddClientModal = false;


    constructor(
        private _productsService: ProductsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _clientsService: ClientsService,
        private dialogRef: MatDialogRef<EditProductComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.productId = data.productId;
        this.nameProduct = data.nameProduct;
    }

    ngOnInit(): void {
        this.searchUserControl.valueChanges
            .pipe(debounceTime(150))
            .subscribe((text) => {
                this.lastSearchText = text;
                this.userSkip = 0;
                this.userResults = [];
                this.loadUsers(text, true);
            });
        if (this.productId) {
            this.productNum = this.productId;
            this.loadProductDetails(this.productNum);
            this.getClients(this.productNum);
        }
    }

    loadProductDetails(productId: number): void {
        this._productsService.getProductById(productId).subscribe(product => {
            if (product) {
                this.productUnitPrice = product.unit_price;
                this.productStock = product.stock;
                this.originalProductStock = product.stock;
            }
            this._changeDetectorRef.detectChanges();
        });
    }

    loadUsers(text: string, reset = false) {
        this.userLoading = true;
        this._clientsService.searchClients({full_name: text}, this.userTake, this.userSkip)
            .subscribe(res => {
                const newUsers = res.results;
                if (reset) {
                    this.userResults = newUsers.map(u => ({
                        id: u.id,
                        full_name: u.full_name,
                        cedula: u.cedula
                    }));
                } else {
                    this.userResults = [
                        ...this.userResults,
                        ...newUsers.map(u => ({
                            id: u.id,
                            full_name: u.full_name,
                            cedula: u.cedula
                        }))
                    ];
                }
                this.userHasMore = (this.userResults.length < res.count);
                this.userLoading = false;
                setTimeout(() => {
                    if (
                        this.userResults.length > 0 &&
                        this.autocompleteTrigger &&
                        this.searchInput &&
                        document.activeElement === this.searchInput.nativeElement
                    ) {
                        this.autocompleteTrigger.openPanel();
                    }
                });
            });
    }

    displayUser(user: any): string {
        return user && user.full_name ? user.full_name : '';
    }

    loadMoreUsers() {
        this.userSkip += this.userTake;
        this.loadUsers(this.lastSearchText, false);
    }

    ngAfterViewInit() {
        this._changeDetectorRef.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Iniciar solo cuando el modal sea visible
        if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            if (this.productId !== undefined) {
                this.productNum = this.productId;
                this.getClients(this.productNum);
                this.loadProductDetails(this.productNum);
            }

            if (this.nameProduct !== undefined) {
                this.stringName = this.nameProduct;
            }

        } else if (changes['isVisible'] && changes['isVisible'].currentValue === false) {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0px';
        }
    }

    onUserSelected(event: any): void {
        const user = event.option.value;
        if (!this.listClients.some(c => c.client_id === user.id)) {
            const quantity = 1;
            const unit_price = this.productUnitPrice;
            const total_price = (parseFloat(unit_price) * quantity).toFixed(2);
            this.listClients.push({
                client_id: user.id,
                client_name: user.full_name,
                quantity,
                unit_price,
                total_price
            });
            this._changeDetectorRef.detectChanges();
            this.toastr.success('Cliente añadido con éxito', 'Éxito');
        } else {
            this.toastr.error('Este cliente ya está agregado.', 'Error');
        }
        this.searchUserControl.setValue('');
    }

    //Servicio: obtener clientes por producto
    getClients(id: number): void {
        this.isLoadingClients = true;
        this._productsService.getClientsForProduct(id).subscribe({
            next: (res) => {
                const clients = res.clients || [];
                this.listClients = clients;
                this.copyListClients = JSON.parse(JSON.stringify(clients));
                clients.forEach((client, idx) => {
                    this._clientsService.getClientById(client.client_id).subscribe(clientData => {
                        this.listClients[idx].client_name = clientData.full_name;
                        this._changeDetectorRef.detectChanges();
                    });
                });
                this.isLoadingClients = false;
                this._changeDetectorRef.detectChanges();
            },
            error: (err) => {
                this.isLoadingClients = false;
                console.error('Error al obtener clientes:', err);
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    //Servicio: obtener clientes por producto
    sendClientsForProduct(): void {
        const payload = {
            product_id: this.productNum,
            clients: this.listClients
                .filter(client => !client['toRemove'])
                .map(client => ({
                    client_id: client.client_id,
                    quantity: client.quantity,
                    unit_price: client.unit_price,
                    total_price: client.total_price
                })),
            is_active: true
        };
        this.isLoading = true;
        this._productsService.sendClientsForProduct(this.productNum, payload).subscribe({
            next: (response) => {
                this.toastr.success('Clienes registrados al producto exitosamente', 'Aviso');
                this.isLoading = false;
                this._productsService.notifyProductsUpdated();
                this.loadProductDetails(this.productNum);
                this.dialogRef.close();
                this._changeDetectorRef.detectChanges();
            },
            error: (err) => {
                this.toastr.error('Hubo un error al registrar al cliente', 'Error');
                this.isLoading = false;
                this._changeDetectorRef.detectChanges();
            }
        });
    }


    //Remover clientes de la lista
    removeClient(index: number): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Vas a eliminar a este usuario',
            message: '¿Estás seguro de querer eliminar al usuario?',
            actions: { confirm: { label: 'Eliminar' } },
        });

        confirmation.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this.listClients.splice(index, 1);
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    hasChanges(): boolean {
        return JSON.stringify(this.listClients) !== JSON.stringify(this.copyListClients);
    }

    get remainingStock(): number {
        const used = this.listClients.reduce((sum, c) => sum + c.quantity, 0);
        return this.originalProductStock - used;
    }


    closeModal(): void {
        const confirm = this._fuseConfirmationService.open({
            title: '¿Seguro que quieres cerrar?',
            message: 'Se perderán los cambios no guardados.',
            actions: { confirm: { label: 'Sí, cerrar' }, cancel: { label: 'No' } }
        });
        confirm.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this.dialogRef.close();
            }
        });
    }

    decreaseClientQuantity(i: number): void {
        const c = this.listClients[i];
        if (c.quantity > 1) {
            c.quantity--;
            c.total_price = (parseFloat(c.unit_price) * c.quantity).toFixed(2);
        }
    }

    increaseClientQuantity(i: number): void {
        if (this.remainingStock > 0) {
            const c = this.listClients[i];
            c.quantity++;
            c.total_price = (parseFloat(c.unit_price) * c.quantity).toFixed(2);
            this._changeDetectorRef.detectChanges();
        } else {
            this.toastr.warning('No hay stock suficiente', 'Aviso');
        }
    }

    validateClientQuantity(client: Client): void {
        if (!client.quantity || client.quantity < 1) {
            client.quantity = 1;
        }
        client.total_price = (parseFloat(client.unit_price) * client.quantity).toFixed(2);
    }

    /*** Add new client ***/
    onAddNewClient() {
        this.showAddClientModal = true;
    }

    onAddClientModalCancel() {
        const confirm = this._fuseConfirmationService.open({
            title: '¿Seguro que quieres cancelar?',
            message: 'Se perderán los datos ingresados.',
            actions: { confirm: { label: 'Sí, cancelar' }, cancel: { label: 'No' } }
        });
        confirm.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this.showAddClientModal = false;
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    onAddClientModalAdd(clientData: any) {
        this.isLoading = true;
        this._clientsService.createClient(clientData).subscribe({
            next: (newClient) => {
                const quantity = 1;
                const unit_price = this.productUnitPrice;
                const total_price = (parseFloat(unit_price) * quantity).toFixed(2);
                this.listClients.push({
                    client_id: newClient.id,
                    client_name: newClient.full_name,
                    quantity,
                    unit_price,
                    total_price
                });
                this.showAddClientModal = false;
                this.isLoading = false;
                this.toastr.success('Cliente añadido con éxito', 'Éxito');
                this._changeDetectorRef.detectChanges();
            },
            error: () => {
                this.isLoading = false;
                this.toastr.error('Error al crear el cliente', 'Error');
                this._changeDetectorRef.detectChanges();
            }
        });
    }

}
