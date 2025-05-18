import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { PricePipe } from '../price.pipe';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatDivider} from '@angular/material/list';
import {Watt} from '../watt.pipe';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  imports: [
    NgIf,
    PricePipe,
    MatButton,
    NgForOf,
    MatCard,
    MatCardTitle,
    MatDivider,
    MatCardContent,
    Watt
  ],
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  @Input() selectedProduct: any;
  @Output() productAddedToBuild = new EventEmitter<any>(); // ⬅️ új EventEmitter
  objectKeys = Object.keys;

  constructor() {}


  addToBuild() {
    if (!this.selectedProduct || !this.selectedProduct.category) return;

    this.productAddedToBuild.emit(this.selectedProduct); // ⬅️ küldi a szülőnek
    alert(`${this.selectedProduct.name} hozzáadva az összeállításhoz.`);
  }

  get portList(): { key: string, value: number }[] {
    if (!this.selectedProduct?.ports) return [];

    return Array.from(this.selectedProduct.ports.entries() as [string, number][]).map(
      ([key, value]) => ({ key, value })
    );
  }

  mapEntries(map: Map<any, any>): [any, any][] {
    return Array.from(map.entries());
  }

  getPortStatus(portObj: { [key: string]: number } | undefined): string {
    if (!portObj || Object.keys(portObj).length === 0) {
      return 'Nincs';
    }

    if (portObj['true'] && portObj['true'] > 0) {
      return `${portObj['true']}`;
    }

    return 'Nincs';
  }



}
