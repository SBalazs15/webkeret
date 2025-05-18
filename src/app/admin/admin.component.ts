import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from '@angular/fire/firestore';

import { Case } from '../../model/case';
import { MotherBoard } from '../../model/motherboard';
import { CPU } from '../../model/cpu';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import {Cooler} from '../../model/cooler';
import {RAM} from '../../model/ram';
import {GPU} from '../../model/gpu';
import {PSU} from '../../model/psu';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatCheckbox,
    MatIcon,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  selectedCategory: string = '';
  availableCategories: string[] = ['Case', 'MotherBoard', 'CPU', 'Cooler', 'RAM', 'GPU', 'PSU'];
  portsArray: { name: string; count: number }[] = [];
  cacheArray: { name: string; size: number }[] = [];
  maxIntakeArray: { name: string; value: number }[] = [];
  FDDArray: { active: boolean, name: string }[] = [];
  HDDArray: { active: boolean, name: string }[] = [];
  SATAArray: { active: boolean, name: string }[] = [];
  PCIArray: { active: boolean, name: string }[] = [];

  caseData: Case = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'Case',
    szelesseg: 0,
    magassag: 0,
    melyeg: 0,
    suly: 0,
    ventCount: 0,
    ventSizes: [],
    motherBoardSizes: [],
    USBcount: 0,
  };

  psuData: PSU = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'PSU',
    power: 0,
    rate: '',
    noise: '',
    type: '',
    PFC: '',
    ventSize: 0,
    maxIntake: new Map<string, number>(),
    tapKapcs: false,
    v110Kapcs: false,
    FDD: new Map<boolean, number>(),
    HDD: new Map<boolean, number>(),
    SATA: new Map<boolean, number>(),
    PCI_Expresss: new Map<boolean, number>(),
  };

  ramData: RAM = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'RAM',
    speed: 0,
    memorySize: 0,
    package: '',
    type: '',
    kesleltetes: '',
    hutoborda: false,
    LED: false,
    voltage: 0
  };


  motherboardData: MotherBoard = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'MotherBoard',
    socket: '',
    chipset: '',
    isServer: false,
    maxMemori: 0,
    memoriSockets: 0,
    sataCount: 0,
    wifi: false,
    bluetooth: false,
    ports: new Map<string, number>(),
    isHdmi: false,
    isDisplayPort: false,
    USBPortCount: 0,
    isHangKartya: false,
    meret: '',
    size: '',
    m2count: 0,
    memoriType: '',
  };

  cpuData: CPU = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'CPU',
    cores: 0,
    thread: 0,
    clockSpeed: 0,
    turboClockSpeed: 0,
    TDP: 0,
    socket: '',
    integratedGPU: '',
    cache: new Map<string, number>(),
  };

  cooler: Cooler = {
    id: 0,
    description: '',
    category: 'Cooler',
    name: '',
    price: 0,
    image: '',
    type: '',
    ventSize: '',
    ventSpeed: '',
    maxNoise: '',
    airFlow: '',
    LED: false,
    size: '',
    socket: [],
    wieght: 0,
    TDP: 0
  };
  gpuData: GPU = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'GPU',
    chipSpeed: 0,
    chipMemoriSpeed: 0,
    recomendedTdp: 0,
    chipset: '',
    chipsetfamily: '',
    cooling: '',
    ventcount: 0,
    memoriAmount: 0,
    memoryType: '',
    memorySavszelesseg: 0,
    maxFelbontas: '',
    DirectX: '',
    TapCsatlakozo: '',
    LED: false,
    color: '',
    usedTech: [],
    DLSS: [],
    VGA: new Map<boolean, number>(),
    DVI: new Map<boolean, number>(),
    HDMI: new Map<boolean, number>(),
    Display: new Map<boolean, number>(),
    Type_C: new Map<boolean, number>(),
    szelesseg: 0,
    hosszusag: 0,
    vastagsag: 0,
  };

  constructor(private firestore: Firestore) {}

  async getNextId(category: string): Promise<number> {
    try {
      const productsCollection = collection(this.firestore, 'Products');
      const q = query(
        productsCollection,
        where('category', '==', category),
        orderBy('id', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return 0;

      const lastDocData = querySnapshot.docs[0].data();
      return lastDocData && lastDocData['id'] !== undefined ? lastDocData['id'] + 1 : 0;
    } catch (error) {
      console.error('Hiba az ID lekérdezésekor:', error);
      return 0;
    }
  }

  async saveProduct() {
    try {
      let productToSave: any;

      switch (this.selectedCategory) {
        case 'Case':
          this.caseData.id = await this.getNextId('Case');
          productToSave = this.caseData;
          break;

        case 'MotherBoard':
          this.motherboardData.id = await this.getNextId('MotherBoard');
          this.motherboardData.ports = this.getPortsMap();
          productToSave = {
            ...this.motherboardData,
            ports: Object.fromEntries(this.motherboardData.ports),
          };
          break;

        case 'CPU':
          this.cpuData.id = await this.getNextId('CPU');
          this.cpuData.cache = this.getCacheMap();
          productToSave = {
            ...this.cpuData,
            cache: Object.fromEntries(this.cpuData.cache),
          };
          break;

        case 'Cooler':
          this.cooler.id = await this.getNextId('Cooler');
          productToSave = this.cooler;
          break;

        case 'RAM':
          this.ramData.id = await this.getNextId('RAM');
          productToSave = this.ramData;
          break;

        case 'GPU':
          this.gpuData.id = await this.getNextId('GPU');

          productToSave = {
            ...this.gpuData,
            VGA: Object.fromEntries(this.gpuData.VGA),
            DVI: Object.fromEntries(this.gpuData.DVI),
            HDMI: Object.fromEntries(this.gpuData.HDMI),
            Display: Object.fromEntries(this.gpuData.Display),
            Type_C: Object.fromEntries(this.gpuData.Type_C),
          };
          break;

        case 'PSU':
          this.psuData.id = await this.getNextId('PSU');

          productToSave = {
            ...this.psuData,
            maxIntake: Object.fromEntries(this.psuData.maxIntake),
            FDD: Object.fromEntries(this.psuData.FDD),
            HDD: Object.fromEntries(this.psuData.HDD),
            SATA: Object.fromEntries(this.psuData.SATA),
            PCI_Expresss: Object.fromEntries(this.psuData.PCI_Expresss),
          };
          break;


      }

      const productCollection = collection(this.firestore, 'Products');
      await addDoc(productCollection, productToSave);

      alert(`${this.selectedCategory} sikeresen mentve!`);
      this.resetForm();
    } catch (error) {
      console.error('Hiba a mentés során:', error);
      alert('Hiba történt a mentés során.');
    }
  }

  updateFDD(isChecked: boolean): void {
    if (isChecked) {
      this.psuData.FDD.set(true, 1);
    } else {
      this.psuData.FDD.delete(true);
    }
  }

  updateHDD(isChecked: boolean): void {
    if (isChecked) {
      this.psuData.HDD.set(true, 1);
    } else {
      this.psuData.HDD.delete(true);
    }
  }

  updateSATA(isChecked: boolean): void {
    if (isChecked) {
      this.psuData.SATA.set(true, 1);
    } else {
      this.psuData.SATA.delete(true);
    }
  }

  addMaxIntakeField(): void {
    this.maxIntakeArray.push({ name: '', value: 0 });
  }

  removeMaxIntakeField(index: number): void {
    this.maxIntakeArray.splice(index, 1);
  }

  updatePCI_Express(isChecked: boolean): void {
    if (isChecked) {
      this.psuData.PCI_Expresss.set(true, 1);
    } else {
      this.psuData.PCI_Expresss.delete(true);
    }
  }

  onFDDInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.psuData.FDD.set(true, Number(input.value));
  }

  onHDDInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.psuData.HDD.set(true, Number(input.value));
  }

  onSATAInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.psuData.SATA.set(true, Number(input.value));
  }

  onPCI_ExpressInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.psuData.PCI_Expresss.set(true, Number(input.value));
  }

  addCacheField() {
    this.cacheArray.push({ name: '', size: 0 });
  }

  removeCacheField(index: number) {
    this.cacheArray.splice(index, 1);
  }

  getCacheMap(): Map<string, number> {
    const map = new Map<string, number>();
    for (const item of this.cacheArray) {
      if (item.name && item.size != null) {
        map.set(item.name.trim(), item.size);
      }
    }
    return map;
  }

  updateUsedTech(input: string): void {
    this.gpuData.usedTech = input
      .split(', ')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  }

  updateDLSS(input: string): void {
    this.gpuData.DLSS = input
      .split(', ')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  }



  updateVGA(isChecked: boolean): void {
    if (isChecked) {
      this.gpuData.VGA.set(true, 1);
    } else {
      this.gpuData.VGA.delete(true);
    }
  }

  updateDVI(isChecked: boolean): void {
    if (isChecked) {
      this.gpuData.DVI.set(true, 1);
    } else {
      this.gpuData.DVI.delete(true);
    }
  }

  updateHDMI(isChecked: boolean): void {
    if (isChecked) {
      this.gpuData.HDMI.set(true, 1);
    } else {
      this.gpuData.HDMI.delete(true);
    }
  }

  updateDisplay(isChecked: boolean): void {
    if (isChecked) {
      this.gpuData.Display.set(true, 1);
    } else {
      this.gpuData.Display.delete(true);
    }
  }

  updateTypeC(isChecked: boolean): void {
    if (isChecked) {
      this.gpuData.Type_C.set(true, 1);
    } else {
      this.gpuData.Type_C.delete(true);
    }
  }

  onVGAInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gpuData.VGA.set(true, input.valueAsNumber);
  }

  onDVIInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gpuData.DVI.set(true, input.valueAsNumber);
  }

  onHDMIInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gpuData.HDMI.set(true, input.valueAsNumber);
  }

  onDisplayInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gpuData.Display.set(true, input.valueAsNumber);
  }

  onTypeCInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gpuData.Type_C.set(true, input.valueAsNumber);
  }

  addPortField() {
    this.portsArray.push({ name: '', count: 1 });
  }

  removePortField(index: number) {
    this.portsArray.splice(index, 1);
  }

  getPortsMap(): Map<string, number> {
    const map = new Map<string, number>();
    for (const port of this.portsArray) {
      if (port.name && port.count != null) {
        map.set(port.name.trim(), port.count);
      }
    }
    return map;
  }

  updateCoolerSockets(input: string): void {
    this.cooler.socket = input
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');
  }

  updateVentSizes(input: string): void {
    this.caseData.ventSizes = input
      .split(',')
      .map((v) => parseInt(v.trim(), 10))
      .filter((n) => !isNaN(n));
  }

  updateMotherboardSizes(input: string): void {
    this.caseData.motherBoardSizes = input
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');
  }

  onCategoryChange(): void {
    console.log('Kiválasztott kategória:', this.selectedCategory);
  }

  updatePorts(input: string): void {
    const portMap = new Map<string, number>();
    input
      .split(',')
      .map((pair) => pair.trim().split(':'))
      .forEach(([key, value]) => {
        if (key && value && !isNaN(+value)) portMap.set(key.trim(), parseInt(value.trim(), 10));
      });
    this.motherboardData.ports = portMap;
  }

  resetForm() {
    this.caseData = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'Case',
      szelesseg: 0,
      magassag: 0,
      melyeg: 0,
      suly: 0,
      ventCount: 0,
      ventSizes: [],
      motherBoardSizes: [],
      USBcount: 0,
    };

    this.motherboardData = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'MotherBoard',
      socket: '',
      chipset: '',
      isServer: false,
      maxMemori: 0,
      memoriSockets: 0,
      sataCount: 0,
      wifi: false,
      bluetooth: false,
      ports: new Map<string, number>(),
      isHdmi: false,
      isDisplayPort: false,
      USBPortCount: 0,
      isHangKartya: false,
      size: '',
      meret: '',
      m2count: 0,
      memoriType: '',
    };

    this.cpuData = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'CPU',
      cores: 0,
      thread: 0,
      clockSpeed: 0,
      turboClockSpeed: 0,
      TDP: 0,
      socket: '',
      integratedGPU: '',
      cache: new Map<string, number>(),
    };

    this.cooler = {
      id: 0,
      description: '',
      category: 'Cooler',
      name: '',
      price: 0,
      image: '',
      type: '',
      ventSize: '',
      ventSpeed: '',
      maxNoise: '',
      airFlow: '',
      LED: false,
      size: '',
      socket: [],
      wieght: 0,
      TDP: 0
    };

    this.ramData = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'RAM',
      speed: 0,
      memorySize: 0,
      package: '',
      type: '',
      kesleltetes: '',
      hutoborda: false,
      LED: false,
      voltage: 0
    };
    this.gpuData = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'GPU',
      chipSpeed: 0,
      chipMemoriSpeed: 0,
      recomendedTdp: 0,
      chipset: '',
      chipsetfamily: '',
      cooling: '',
      ventcount: 0,
      memoriAmount: 0,
      memoryType: '',
      memorySavszelesseg: 0,
      maxFelbontas: '',
      DirectX: '',
      TapCsatlakozo: '',
      LED: false,
      color: '',
      usedTech: [],
      DLSS: [],
      VGA: new Map<boolean, number>(),
      DVI: new Map<boolean, number>(),
      HDMI: new Map<boolean, number>(),
      Display: new Map<boolean, number>(),
      Type_C: new Map<boolean, number>(),
      szelesseg: 0,
      hosszusag: 0,
      vastagsag: 0,
    };

    this.psuData = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'PSU',
      power: 0,
      rate: '',
      noise: '',
      type: '',
      PFC: '',
      ventSize: 0,
      maxIntake: new Map<string, number>(),
      tapKapcs: false,
      v110Kapcs: false,
      FDD: new Map<boolean, number>(),
      HDD: new Map<boolean, number>(),
      SATA: new Map<boolean, number>(),
      PCI_Expresss: new Map<boolean, number>(),
    };
    this.cacheArray = [];
    this.maxIntakeArray = [];
    this.FDDArray = [];
    this.HDDArray = [];
    this.SATAArray = [];
    this.PCIArray = [];
  }
}
