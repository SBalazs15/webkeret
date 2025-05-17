import { Component } from '@angular/core';
import { Build } from '../../model/build';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import {CategorySidebarComponent} from '../category-sidebar/category-sidebar.component';
import {ProductGridComponent} from '../product-grid/product-grid.component';
import {ProductDetailsComponent} from '../product-details/product-details.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  imports: [
    CategorySidebarComponent,
    ProductGridComponent,
    ProductDetailsComponent,
    NgIf
  ],
  styleUrls: ['./build.component.css']
})
export class BuildComponent {
  selectedCategory :string | null = 'Case';
  selectedProduct: any = null;
  buildModel: Partial<Build> = {};
  private _caseSizes: string[] = [];

  constructor(private firestore: Firestore, private auth: Auth) {}

  get caseSizes(): string[] {
    const newCaseSizes = this.buildModel.case?.motherBoardSizes || [];
    if (this.arraysAreDifferent(this._caseSizes, newCaseSizes)) {
      this._caseSizes = newCaseSizes;
    }
    return this._caseSizes;
  }

  get melyseg(): number{
    return <number>this.buildModel.case?.melyeg;
  }

  get szelesseg(): number{
    return <number>this.buildModel.case?.szelesseg;
  }
  get memtype(): string{
    return <string>this.buildModel.motherboard?.memoriType;
  }

  get memsize(): number{
    return <number>this.buildModel.motherboard?.maxMemori;
  }
  get socket():string{
    return <string>this.buildModel.motherboard?.socket;
  }


  private arraysAreDifferent(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return true;
    }
    return false;
  }

  onCategorySelect(category: string) {
    this.selectedCategory = category;
    this.selectedProduct = null;
  }

  onProductSelect(product: any) {
    this.selectedProduct = product;
  }

  onAddToBuild(product: any) {
    if (!product?.category) return;

    switch (product.category) {
      case 'Case':
        this.buildModel.case = product;
        break;
      case 'MotherBoard':
        this.buildModel.motherboard = product;
        break;
      case 'CPU':
        this.buildModel.cpu = product;
        break;
      case 'Cooler':
        this.buildModel.cooler = product;
        break;
      case 'RAM':
        this.buildModel.ram = product;
        break;
      case 'GPU':
        this.buildModel.gpu = product;
        break;
      case 'PSU':
        this.buildModel.psu = product;
        break;
      default:
        console.warn('Ismeretlen kategória:', product.category);
    }

    console.log('Frissített build:', this.buildModel);
  }

  onNextCategory() {
    const categories = ['Case', 'MotherBoard', 'CPU', 'Cooler', 'RAM', 'GPU', 'PSU'];
    if (this.selectedCategory != null) {
      const currentIndex = categories.indexOf(this.selectedCategory);
      if (currentIndex < categories.length - 1) {
        this.selectedCategory = categories[currentIndex + 1];
        this.selectedProduct = null;
      }
    }
  }

  async onSaveBuild() {
    const requiredCategories: (keyof Build)[] = [
      'case',
      'motherboard',
      'cpu',
      'ram',
      'psu',
    ];

    for (const cat of requiredCategories) {
      if (!this.buildModel[cat]) {
        alert('Csak kész buildet lehet menteni! Hiányzik: ' + cat);
        return;
      }
    }

    const user = await this.auth.currentUser;
    if (!user) {
      alert('Amíg nem jelentkezel be, nem tudsz menteni.');
      return;
    }

    this.buildModel.uid = user.uid;
    this.buildModel.puBlic=false;

    try {
      const buildsCollection = collection(this.firestore, 'Builds');
      await addDoc(buildsCollection, this.buildModel);
      alert('A build sikeresen mentve!');
    } catch (err) {
      console.error('Mentési hiba:', err);
      alert('Hiba történt a mentés során.');
    }
  }
}
