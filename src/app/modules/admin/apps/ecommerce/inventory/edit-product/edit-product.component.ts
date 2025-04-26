import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa estos módulos de Angular Material:
import { MatIconModule }   from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,    // ← para <mat-icon [svgIcon]="…">
    MatButtonModule,  // ← para mat-flat-button, mat-icon-button
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() productId: number;
  productNum: number = 0;

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']) {
      if (changes['isVisible'].currentValue === true) {
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      } else {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0px';
      }
    }

    if (changes['productId'] && changes['productId'].currentValue !== undefined) {
      this.productNum = this.productId;
      console.log('Product Num en abc:', this.productNum);
    }
  }

  closeModal(): void {
    this.isVisible = false;
    document.body.style.overflow = 'auto';
    this.close.emit();
  }
}
