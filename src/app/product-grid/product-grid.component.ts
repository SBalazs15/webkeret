import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { CPU } from '../../model/cpu';
import { Case } from '../../model/case';
import { MotherBoard } from '../../model/motherboard';
import { Cooler } from '../../model/cooler';
import { RAM } from '../../model/ram';
import { PSU } from '../../model/psu';
import { GPU } from '../../model/gpu';


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
      Gépház: [],
      Alaplap: [],
      Processzor: [],
      Hűtő: [],
      RAM: [],
      Videókártya: [],
      Tápegység: [],

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
