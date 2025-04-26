import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() productId: number;
  productNum: number = 0;
  
  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && changes['productId'].currentValue !== undefined) {
      this.abc();
    }
  }


  abc(){
    this.productNum = this.productId;
    console.log('Product Num en abc:', this.productNum);
  }


  closeModal() :void {
    this.isVisible = false;
    this.close.emit();
  }

}
