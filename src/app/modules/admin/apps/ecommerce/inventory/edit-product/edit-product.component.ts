import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa estos módulos de Angular Material:
import { MatIconModule }   from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Client, ProductsService } from 'app/services/products.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ClientsService } from 'app/services/clients.service';
import { finalize } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,    // ← para <mat-icon [svgIcon]="…">
    MatButtonModule,  // ← para mat-flat-button, mat-icon-button
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
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


  constructor(
    private _productsService: ProductsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private toastr: ToastrService,
    private _clientsService: ClientsService
  )
  {
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
    }

    loadUsers(text: string, reset = false) {
        this.userLoading = true;
        this._clientsService.searchClients({ full_name: text }, this.userTake, this.userSkip)
            .subscribe(res => {
                const newUsers = res.results;
                if (reset) {
                    this.userResults = newUsers.map(u => ({
                        full_name: u.full_name,
                        cedula: u.cedula
                    }));
                } else {
                    this.userResults = [...this.userResults, ...newUsers];
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

  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    //Iniciar solo cuando el modal sea visible
    if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;

      // 🔥 Solo cuando el modal se abre
      if (this.productId !== undefined) {
        this.productNum = this.productId;
        this.getClients(this.productNum);
      }

      if (this.nameProduct !== undefined) {
        this.stringName = this.nameProduct;
      }

    } else if (changes['isVisible'] && changes['isVisible'].currentValue === false) {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    }
  }

  //Servicio: obtener clientes por producto
  getClients(id: number): void{
      this.isLoadingClients = true;
      this._productsService.getClientsForProduct(id).subscribe({
        next: (clients) => {
          this.listClients = clients.clients || [];
          this.copyListClients = JSON.parse(JSON.stringify(this.listClients));
          this.isLoadingClients = false;
          this._changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.isLoadingClients = false;
        console.error('Error al obtener clientes:', err);
        this._changeDetectorRef.detectChanges();
      }
      })
  }

  //Servicio: obtener clientes por producto
  sendClientsForProduct(): void {
    // Construir el body
    const payload = {
      product_id: this.productNum,
      clients: this.listClients.map(client => ({
        client_id: client.client_id,
        quantity: client.quantity,
        unit_price: client.unit_price,
        total_price: client.total_price
      })),
      is_active: true
    };

    console.log('Enviando payload:', payload);
    console.log('Se envia esta lista',this.listClients);

    this.isLoading = true;
    this._productsService.sendClientsForProduct(this.productNum, payload).subscribe({
      next: (response) => {
        this.toastr.success('Clienes registrados al producto exitosamente', 'Aviso');
        this.isLoading = false;
        this._productsService.notifyProductsUpdated();
        this.closeModal();
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
      title  : 'Vas a eliminar a este usuario',
      message: '¿Estás seguro de querer eliminar al usuario?',
      actions: {
          confirm: {
              label: 'Eliminar',
          },
      },
    });

    confirmation.afterClosed().subscribe(result => {
      if ( result === 'confirmed' ){
        this.listClients.splice(index, 1);
        this._changeDetectorRef.detectChanges();
      }
   });
  }

  hasChanges(): boolean {
    return JSON.stringify(this.listClients) !== JSON.stringify(this.copyListClients);
  }


  closeModal(): void {
    this.isVisible = false;
    document.body.style.overflow = 'auto';
    this.close.emit();
  }

  decreaseClientQuantity(i: number): void {
    const c = this.listClients[i];
    if (c.quantity > 1) {
      c.quantity--;
    }
  }

  increaseClientQuantity(i: number): void {
    this.listClients[i].quantity++;
  }

  validateClientQuantity(client: Client): void {
    if (!client.quantity || client.quantity < 1) {
      client.quantity = 1;
    }
  }

}
