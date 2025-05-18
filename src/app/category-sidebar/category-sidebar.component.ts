import { Component, EventEmitter, Output } from '@angular/core';
import { NgForOf, UpperCasePipe } from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-category-sidebar',
  templateUrl: './category-sidebar.component.html',
  imports: [
    UpperCasePipe,
    NgForOf,
    MatButton
  ],
  styleUrls: ['./category-sidebar.component.css']
})
export class CategorySidebarComponent {
  @Output() categorySelected = new EventEmitter<string>();
  @Output() saveBuild = new EventEmitter<void>();
  @Output() nextCategory = new EventEmitter<void>();

  categories: string[] = ['Case', 'MotherBoard', 'CPU', 'RAM', 'Cooler', 'GPU', 'PSU'];
  currentIndex = 0;

  selectCategory(category: string) {
    this.categorySelected.emit(category);
  }

  next() {
    if (this.currentIndex < this.categories.length - 1) {
      this.currentIndex++;
      this.categorySelected.emit(this.categories[this.currentIndex]);
    }
  }


  onSave() {
    this.saveBuild.emit();
  }
}
