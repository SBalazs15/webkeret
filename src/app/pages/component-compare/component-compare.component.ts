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
import { RAM } from '../../../model/ram';
import { MotherBoard } from '../../../model/motherboard';



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
  ramList: { name: string }[] = [];
  motherBoardList: { name: string }[] = [];

  ramDetails: RAM[] = [];
  motherBoardDetails: MotherBoard[] = [];
  cpuDetails: CPU[] = [];
  gpuDetails: GPU[] = [];

  selectedType: 'cpu' | 'gpu' | 'ram' | 'motherboard' | null = null;
  userMessage: string = '';

  comparisonLeft: CPU | GPU | RAM | MotherBoard | null = null;
  comparisonRight: CPU | GPU | RAM | MotherBoard | null = null;

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

    // RAM-ok lekérése
    const ramQuery = query(productsRef, where('category', '==', 'RAM'));
    const ramSnap = await getDocs(ramQuery);
    this.ramList = ramSnap.docs.map(doc => ({ name: doc.data()['name'] }));
    this.ramDetails = ramSnap.docs.map(doc => doc.data() as RAM);

    // Alaplapok lekérése
    const mbQuery = query(productsRef, where('category', '==', 'MotherBoard'));
    const mbSnap = await getDocs(mbQuery);
    this.motherBoardList = mbSnap.docs.map(doc => ({ name: doc.data()['name'] }));
    this.motherBoardDetails = mbSnap.docs.map(doc => doc.data() as MotherBoard);
  }


  get filteredListLeft() {
    const list =
      this.selectedType === 'cpu' ? this.cpuList :
        this.selectedType === 'gpu' ? this.gpuList :
          this.selectedType === 'ram' ? this.ramList :
            this.selectedType === 'motherboard' ? this.motherBoardList :
              [];

    return list.filter(item =>
      item.name.toLowerCase().includes(this.searchQueryLeft.toLowerCase())
    );
  }

  get filteredListRight() {
    const list =
      this.selectedType === 'cpu' ? this.cpuList :
        this.selectedType === 'gpu' ? this.gpuList :
          this.selectedType === 'ram' ? this.ramList :
            this.selectedType === 'motherboard' ? this.motherBoardList :
              [];

    return list.filter(item =>
      item.name.toLowerCase().includes(this.searchQueryRight.toLowerCase())
    );
  }

  selectType(type: 'cpu' | 'gpu'| 'ram' | 'motherboard') {
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
    let dataList: any[] = [];

    switch (this.selectedType) {
      case 'cpu':
        dataList = this.cpuDetails;
        break;
      case 'gpu':
        dataList = this.gpuDetails;
        break;
      case 'ram':
        dataList = this.ramDetails;
        break;
      case 'motherboard':
        dataList = this.motherBoardDetails;
        break;
    }

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
    console.log(map)
    if (map instanceof Map) {
      return Array.from(map.entries()).map(([key, value]) => ({ key, value }));
    } else {
      // Ha sima objektum (pl. Firestore nem ment el Map-ként)
      return Object.entries(map).map(([key, value]) => ({ key, value }));
    }

  }

  boolLabel(value: boolean | string | null | undefined): string {
    if (value === true || value === 'true') return 'Igen';

    // Ha falsy érték, vagy üres string: "Nem"
    if (!value || value === 'false') return 'Nem';

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

  get leftRAM(): RAM | null {
    return this.selectedType === 'ram' ? this.comparisonLeft as RAM : null;
  }

  get rightRAM(): RAM | null {
    return this.selectedType === 'ram' ? this.comparisonRight as RAM : null;
  }

  get leftMotherboard(): MotherBoard | null {
    return this.selectedType === 'motherboard' ? this.comparisonLeft as MotherBoard : null;
  }

  get rightMotherboard(): MotherBoard | null {
    return this.selectedType === 'motherboard' ? this.comparisonRight as MotherBoard : null;
  }




}
