import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa estos módulos de Angular Material:
import { MatIconModule }   from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Client, ProductsService } from 'app/services/products.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,    // ← para <mat-icon [svgIcon]="…">
    MatButtonModule,  // ← para mat-flat-button, mat-icon-button
    FormsModule,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() productId: number;
  @Input() nameProduct: string = '';
  productNum: number = 0;
  stringName: string = '';
  quantity: number = 1;
  listClients: Client[] = [];
  isLoadingClients: boolean = true;



  constructor(
    private _productsService: ProductsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,

  )
  {
  }

  ngOnInit(): void {}

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
          this.listClients = clients.clients;
          console.log(this.listClients);

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
      product_id: this.productNum, // tu número de producto
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

    // Enviar al servicio
    this._productsService.sendClientsForProduct(this.productNum, payload).subscribe({
      next: (response) => {
        console.log('Clientes enviados exitosamente:', response);
        this._changeDetectorRef.detectChanges();
        // Aquí podrías cerrar el modal o mostrar un mensaje de éxito
      },
      error: (err) => {
        console.error('Error al enviar clientes:', err);
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
