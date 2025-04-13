import { Component, EventEmitter, Output } from '@angular/core';
import {NgForOf, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-category-sidebar',
  templateUrl: './category-sidebar.component.html',
  imports: [
    UpperCasePipe,
    NgForOf
  ],
  styleUrls: ['./category-sidebar.component.css']
})
export class CategorySidebarComponent {
  @Output() categorySelected = new EventEmitter<string>();

  categories: string[] = ['Gépház', 'Alaplap', 'Processzor', 'Hűtő', 'RAM', 'Videókártya', 'Tápegység'];

  selectCategory(category: string) {
    this.categorySelected.emit(category);
  }
}
