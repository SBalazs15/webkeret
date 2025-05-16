import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import {MatButton} from '@angular/material/button';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { CPU } from '../../../model/cpu';
import { GPU } from '../../../model/gpu';


@Component({
  selector: 'app-component-compare',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButton
  ],
  templateUrl: './component-compare.component.html',
  styleUrls: ['./component-compare.component.css']
})
export class ComponentCompareComponent {
  cpuList: { name: string }[] = [];
  gpuList: { name: string }[] = [];

  cpuDetails: CPU[] = [];
  gpuDetails: GPU[] = [];

  selectedType: 'cpu' | 'gpu' | null = null;
  userMessage: string = '';

  comparisonLeft: CPU | GPU | null = null;
  comparisonRight: CPU | GPU | null = null;

  searchQueryLeft = '';
  searchQueryRight = '';

  selectedLeft: string  = '';
  selectedRight: string = '';
  isComparing = false;


  constructor(private firestore: Firestore,) {
  }

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    const productsRef = collection(this.firestore, 'Products');

    // CPU-k lekérése
    const cpuQuery = query(productsRef, where('category', '==', 'CPU'));
    const cpuSnap = await getDocs(cpuQuery);
    this.cpuList = cpuSnap.docs.map(doc => ({ name: doc.data()['name'] }));
    this.cpuDetails = cpuSnap.docs.map(doc => doc.data() as CPU);

    // GPU-k lekérése
    const gpuQuery = query(productsRef, where('category', '==', 'GPU'));
    const gpuSnap = await getDocs(gpuQuery);
    this.gpuList = gpuSnap.docs.map(doc => ({ name: doc.data()['name'] }));
    this.gpuDetails = gpuSnap.docs.map(doc => doc.data() as GPU);
  }


  get filteredListLeft() {
    const list = this.selectedType === 'cpu' ? this.cpuList : this.gpuList;
    return list.filter(item =>
      item.name.toLowerCase().includes(this.searchQueryLeft.toLowerCase())
    );
  }

  get filteredListRight() {
    const list = this.selectedType === 'cpu' ? this.cpuList : this.gpuList;
    return list.filter(item =>
      item.name.toLowerCase().includes(this.searchQueryRight.toLowerCase())
    );
  }

  selectType(type: 'cpu' | 'gpu') {
    if (this.selectedType === type) {
      this.selectedType = null;
    } else {
      this.selectedType = type;
    }
    this.searchQueryLeft = '';
    this.searchQueryRight = '';
    this.selectedLeft = 'null';
    this.selectedRight = 'null';
  }

  onSelectLeft(event: any) {
    this.selectedLeft = event.option.value;
    this.searchQueryLeft = this.selectedLeft;
  }

  onSelectRight(event: any) {
    this.selectedRight = event.option.value;
    this.searchQueryRight = this.selectedRight;
  }

// Segítség a kulcsok lekéréséhez HTML-ben
  objectKeys = Object.keys;


  compareItems() {
    if (!this.selectedLeft || !this.selectedRight) {
      this.comparisonLeft = null;
      this.comparisonRight = null;
      this.userMessage = 'Kérlek, válassz ki két alkatrészt az összehasonlításhoz.';
      return;
    }

    const dataList = this.selectedType === 'cpu' ? this.cpuDetails : this.gpuDetails;

    this.comparisonLeft = dataList.find(item => item.name === this.selectedLeft) || null;
    this.comparisonRight = dataList.find(item => item.name === this.selectedRight) || null;

    this.userMessage = ''; // siker esetén töröljük az üzenetet
    this.isComparing = true;
  }

  resetSelection(side: 'left' | 'right') {
    if (side === 'left') {
      this.selectedLeft = '';
      this.searchQueryLeft = '';
      this.comparisonLeft = null;
    } else {
      this.selectedRight = '';
      this.searchQueryRight = '';
      this.comparisonRight = null;
    }

    if (!this.selectedLeft || !this.selectedRight) {
      this.isComparing = false;
    }
  }

  mapToArray(map: Map<any, any> | Record<any, any>): { key: any, value: any }[] {
    if (map instanceof Map) {
      return Array.from(map.entries()).map(([key, value]) => ({ key, value }));
    } else {
      // Ha sima objektum (pl. Firestore nem ment el Map-ként)
      return Object.entries(map).map(([key, value]) => ({ key, value }));
    }
  }

  boolLabel(value: boolean | string): string {
    if (value === true || value === 'true') return 'Igen';
    if (value === false || value === 'false') return 'Nem';
    return String(value);
  }

  get leftCPU(): CPU | null {
    return this.selectedType === 'cpu' ? this.comparisonLeft as CPU : null;
  }

  get rightCPU(): CPU | null {
    return this.selectedType === 'cpu' ? this.comparisonRight as CPU : null;
  }

  get leftGPU(): GPU | null {
    return this.selectedType === 'gpu' ? this.comparisonLeft as GPU : null;
  }

  get rightGPU(): GPU | null {
    return this.selectedType === 'gpu' ? this.comparisonRight as GPU : null;
  }



}
