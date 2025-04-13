import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
  @Input() category: string | null = null;
  @Output() productSelected = new EventEmitter<any>();

  products: any[] = [];



  ngOnChanges() {
    if (this.category) {
      // Később backend-lekérés jön ide
      this.products = this.getProductsByCategory(this.category);
    }
  }

  getProductsByCategory(category: string): any[] {
    // Dummy adatok teszteléshez (később jön ide API hívás)
    const mockProducts: { [key: string]: { name: string; image: string }[] } = {
      Gépház: [
        { name: 'CORSAIR 3000', image: '/kepek/x.png' }
      ],
      Alaplap: [
        { name: 'ASUS B650E', image: '/kepek/x.png' }
      ],
      Processzor: [
        { name: 'Intel i7', image: '/kepek/x.png' },
        { name: 'AMD Ryzen 5', image: '/kepek/x.png' }
      ],
      Hűtő: [
        { name: 'CORSAIR A115', image: '/kepek/x.png' },
      ],
      RAM: [
        { name: 'CORSAIR DOMINATOR 32GB', image: '/kepek/x.png' },
      ],
      Videókártya: [
        { name: 'NVIDIA RTX 3080', image: '/kepek/x.png' }
      ],
      Tápegység: [
        { name: 'CORSAIR RM 750x', image: 'x.png' }
      ],

    };

    return mockProducts[category] || [];
  }

  selectProduct(product: any) {
    this.productSelected.emit(product);
  }

  get isCategorySelected() {
    return this.category !== null && this.category !== '';
  }
}
