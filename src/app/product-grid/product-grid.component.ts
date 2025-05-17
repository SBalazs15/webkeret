  import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
  import { NgForOf, NgIf } from '@angular/common';
  import { Firestore, collection, collectionData } from '@angular/fire/firestore';
  import { map } from 'rxjs/operators';

  @Component({
    selector: 'app-product-grid',
    templateUrl: './product-grid.component.html',
    imports: [
      NgForOf,
      NgIf
    ],
    styleUrls: ['./product-grid.component.css']
  })
  export class ProductGridComponent implements OnChanges {
    @Input() category: string | null = null;
    @Input() caseSize: string[] | null = null;
    @Input() caseMelyseg: number | null = null;
    @Input() caseSzelesseg: number | null = null;
    @Output() productSelected = new EventEmitter<any>();

    products: any[] = [];
    selectedProduct: any = null;
    @Input() maxMemory!: number;
    @Input() memoryType!: string;
    @Input() socket!: string;

    constructor(private firestore: Firestore) {}

    ngOnChanges() {
      if (this.category && this.category.trim() !== '') {
        this.fetchProductsByCategory(this.category);
      } else {
        this.products = [];
        this.selectedProduct = null;
      }
    }

    fetchProductsByCategory(category: string) {
      const productsRef = collection(this.firestore, 'Products');
      collectionData(productsRef, { idField: 'id' })
        .pipe(
          map((data: any[]) => {
            let filtered = data.filter(product => product.category === category);

            if (category === 'MotherBoard' && this.caseSize?.length) {
              filtered = filtered.filter(product =>
                product.meret != null && this.caseSize!.includes(product.meret)
              );
            }

            if (category === 'CPU' && this.socket) {
              filtered = filtered.filter(product =>
                product.socket===this.socket
              );
            }

            if (category === 'Cooler' && this.socket && this.caseMelyseg != null) {
              filtered = filtered.filter(product => {
                const matchesSocket = product.socket?.includes(this.socket);

                // Méret parszolása: "150 x 165 x 161"
                const sizeParts = product.size?.split('x').map((part: string) => parseInt(part.trim(), 10));
                const height = sizeParts && sizeParts.length === 3 ? sizeParts[1] : null;

                const fitsHeight = height !== null && this.caseMelyseg!==null && height < this.caseMelyseg;

                return matchesSocket && fitsHeight;
              });
            }


            if (category === 'RAM' && this.memoryType&&this.maxMemory) {
              filtered = filtered.filter(product =>
                product.type===this.memoryType&&product.memorySize<=this.maxMemory
              );
            }

            if (category === 'GPU' && this.caseSzelesseg&&this.caseMelyseg) {
              filtered = filtered.filter(product =>
                this.caseMelyseg!=null && this.caseSzelesseg!=null && product.szelesseg<=this.caseMelyseg && product.hosszusag<=this.caseSzelesseg
              );
            }
            return filtered;
          })
        )
        .subscribe((filteredProducts) => {
          this.products = filteredProducts;
          this.selectedProduct = null;
        });
    }

    selectProduct(product: any) {
      this.selectedProduct = product;
      this.productSelected.emit(product);
    }

    get isCategorySelected() {
      return this.category !== null && this.category !== '';
    }
  }
