import { Component } from '@angular/core';
import {ProductGridComponent} from '../product-grid/product-grid.component';
import {ProductDetailsComponent} from '../product-details/product-details.component';
import {CategorySidebarComponent} from '../category-sidebar/category-sidebar.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  imports: [
    ProductGridComponent,
    ProductDetailsComponent,
    CategorySidebarComponent,
    NgIf
  ],
  styleUrls: ['./build.component.css']
})
export class BuildComponent {
  selectedCategory = '';
  selectedProduct: any = null;

  onCategorySelect(category: string) {
    this.selectedCategory = category;
    this.selectedProduct = null; // új kategóriánál törlődik a kiválasztott termék
  }

  onProductSelect(product: any) {
    this.selectedProduct = product;
  }
}
