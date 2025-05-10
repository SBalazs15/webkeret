import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import {MatButton} from '@angular/material/button';

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
  selectedType: 'cpu' | 'gpu' | null = null;

  searchQueryLeft = '';
  searchQueryRight = '';

  selectedLeft: string  = '';
  selectedRight: string = '';

  cpuList = [
    { name: 'Intel Core i5-12400F' },
    { name: 'AMD Ryzen 5 5600X' },
    { name: 'Intel Core i7-12700K' }
  ];

  gpuList = [
    { name: 'NVIDIA RTX 3060' },
    { name: 'AMD Radeon RX 6700 XT' },
    { name: 'NVIDIA RTX 4070' }
  ];

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

  comparisonLeft: any = null;
  comparisonRight: any = null;

// Segítség a kulcsok lekéréséhez HTML-ben
  objectKeys = Object.keys;

// Példaadatok, amiket „lekérdezünk”
  cpuDetails = [
    { name: 'Intel Core i5-12400F', cores: 6, threads: 12, baseClock: '2.5GHz' },
    { name: 'AMD Ryzen 5 5600X', cores: 6, threads: 12, baseClock: '3.7GHz' },
    { name: 'Intel Core i7-12700K', cores: 12, threads: 20, baseClock: '3.6GHz' }
  ];

  gpuDetails = [
    { name: 'NVIDIA RTX 3060', memory: '12GB', tdp: '170W', baseClock: '1.32GHz' },
    { name: 'AMD Radeon RX 6700 XT', memory: '12GB', tdp: '230W', baseClock: '2.32GHz' },
    { name: 'NVIDIA RTX 4070', memory: '12GB', tdp: '200W', baseClock: '1.92GHz' }
  ];

  compareItems() {
    if (!this.selectedLeft || !this.selectedRight) {
      this.comparisonLeft = null;
      this.comparisonRight = null;
      return;
    }

    const dataList = this.selectedType === 'cpu' ? this.cpuDetails : this.gpuDetails;

    this.comparisonLeft = dataList.find(item => item.name === this.selectedLeft) || null;
    this.comparisonRight = dataList.find(item => item.name === this.selectedRight) || null;
  }

}
