import { Component, Input } from '@angular/core';
import { CPU } from '../../model/cpu.model';
import { Case } from '../../model/case.model';
import { Cooler } from '../../model/cooler.model';
import { MotherBoard } from '../../model/motherboard.model';
import { RAM } from '../../model/ram.model';
import { PSU } from '../../model/psu.model';
import { GPU } from '../../model/gpu.model';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  @Input() selectedProduct: any;

  constructor() { }

  getDetails(): string {
    if (this.selectedProduct instanceof CPU) {
      return `Mágok száma: ${this.selectedProduct.cores}, TDP: ${this.selectedProduct.TDP} W, Socket: ${this.selectedProduct.socket}, Órajel: ${this.selectedProduct.clockSpeedGhz} GHz, Cache: ${this.getCacheDetails(this.selectedProduct.cache)}`;
    }
    if (this.selectedProduct instanceof Case) {
      return `Méretek: ${this.selectedProduct.dimensions.join('x')} mm, Szellőzők száma: ${this.selectedProduct.ventCount}, Támogatott alaplap méretek: ${this.selectedProduct.motherBoardSizes.join(', ')}`;
    }
    if (this.selectedProduct instanceof Cooler) {
      return `Méret: ${this.selectedProduct.size} mm, Socket: ${this.selectedProduct.socket}, TDP: ${this.selectedProduct.TDP} W`;
    }
    if (this.selectedProduct instanceof MotherBoard) {
      return `Socket: ${this.selectedProduct.socket}, Max memória: ${this.selectedProduct.maxMemori} GB, WiFi: ${this.selectedProduct.wifi ? 'Igen' : 'Nem'}, Bluetooth: ${this.selectedProduct.bluetooth ? 'Igen' : 'Nem'}, Portok: ${this.getPortsDetails(this.selectedProduct.ports)}`;
    }
    if (this.selectedProduct instanceof RAM) {
      return `Sebesség: ${this.selectedProduct.speed} MHz, Memória mérete: ${this.selectedProduct.memorySize} GB, Típus: ${this.selectedProduct.type}, TDP: ${this.selectedProduct.TDP} W`;
    }
    if (this.selectedProduct instanceof PSU) {
      return `Teljesítmény: ${this.selectedProduct.power} W, Hatékonyság: ${this.selectedProduct.rate}, Zajszint: ${this.selectedProduct.noise}`;
    }
    if (this.selectedProduct instanceof GPU) {
      return `CUDA magok száma: ${this.selectedProduct.cuda}, Memória: ${this.selectedProduct.memori} GB, Sebesség: ${this.selectedProduct.speed} MHz, TDP: ${this.selectedProduct.tdp} W`;
    }
    return 'Nincsenek elérhető részletek';
  }

  private getCacheDetails(cache: Map<string, number>): string {
    let cacheDetails = '';
    cache.forEach((size, level) => {
      cacheDetails += `${level}: ${size} KB, `;
    });
    return cacheDetails.slice(0, -2);
  }

  private getPortsDetails(ports: Map<string, number>): string {
    let portsDetails = '';
    ports.forEach((quantity, type) => {
      portsDetails += `${type}: ${quantity} port, `;
    });
    return portsDetails.slice(0, -2);
  }
}
