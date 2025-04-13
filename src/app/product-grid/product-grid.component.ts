import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { CPU } from '../../model/cpu.model';
import { Case } from '../../model/case.model';
import { MotherBoard } from '../../model/motherboard.model';
import { Cooler } from '../../model/cooler.model';
import { RAM } from '../../model/ram.model';
import { PSU } from '../../model/psu.model';
import { GPU } from '../../model/gpu.model';


@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
  @Input() category: string | null = null;
  @Output() productSelected = new EventEmitter<any>();

  products: any[] = [];



  ngOnChanges() {
    if (this.category) {
      // Később backend-lekérés jön ide
      this.products = this.getProductsByCategory(this.category);
    }
  }

  getProductsByCategory(category: string): any[] {
    // Dummy adatok teszteléshez (később jön ide API hívás)
    const mockProducts: { [key: string]: { name: string; image: string }[] } = {
      Gépház: [
        new Case(1, 'CORSAIR 4000D Airflow', 'Mid tower ATX ház, optimális légáramlással', 25000, 'Gépház', [46, 21, 45], 3, [120, 140], ['ATX', 'mATX', 'ITX'], '/kepek/x.png'),
        new Case(2, 'NZXT H510', 'Elegáns ATX ház, egyszerű kábelkezelés', 30000, 'Gépház', [42, 20, 44], 2, [120], ['ATX', 'mATX'], '/kepek/x.png')
      ],
      Alaplap: [
        new MotherBoard(1, 'ASUS ROG Strix B550-F', 'Alaplap AM4-es foglalattal, 12+2 VRM fázis, PCIe 4.0 támogatás', 45000, 'Alaplap', 'AM4', 64, true, true,
          new Map([
            ['USB 3.2', 6],
            ['USB-C', 2],
            ['HDMI', 1],
            ['Ethernet', 1],
          ]), '/kepek/x.png'
        ),
        new MotherBoard(2, 'MSI MAG B660 TOMAHAWK', '12. generációs Intel Core támogatás, PCIe 5.0, WiFi 6', 60000, 'Alaplap', 'LGA1700', 64, true, true,
          new Map([
            ['USB 3.2', 4],
            ['USB-C', 1],
            ['DisplayPort', 1],
            ['Ethernet', 1],
          ]), '/kepek/x.png'
        )
      ],
      Processzor: [
        new CPU(1, 'Intel Core i7-12700K', '12 magos 20 szálas processzor', 150000, 'Processzor', 12, 125, 'LGA1700',
          new Map([
            ['L1', 512],
            ['L2', 1024],
            ['L3', 16384]
          ]), 3.6, '/kepek/x.png'),
        new CPU(2, 'AMD Ryzen 5 7600X', '6 magos 12 szálas processzor', 95000, 'Processzor', 6, 105, 'AM5',
          new Map([
            ['L1', 384],
            ['L2', 512],
            ['L3', 8192]
          ]), 4.7, '/kepek/x.png'
        )
      ],
      Hűtő: [
        new Cooler(1, 'Cooler Master Hyper 212', 'Hatékony levegős hűtés, 4 hőcsővel', 12000, 'Hűtő', 120, 'LGA1151', 150,'/kepek/x.png'),
        new Cooler(2, 'Noctua NH-D15', 'Dupla torony hűtés, nagy teljesítmény', 35000, 'Hűtő', 140, 'AM4', 250,'/kepek/x.png')
      ],
      RAM: [
        new RAM(1, 'Corsair Vengeance LPX 16GB', '16 GB DDR4 memória, 3200 MHz sebesség, alacsony profilú hűtőbordával', 22000, 'RAM', 3200, 16, 'DDR4', 35, '/kepek/x.png'),
        new RAM(2, 'G.Skill Ripjaws V 32GB', '32 GB DDR4 memória, 3600 MHz sebesség, kiváló hűtés és stabilitás', 45000, 'RAM', 3600, 32, 'DDR4', 45, '/kepek/x.png')
      ],
      Videókártya: [
        new GPU(1, 'NVIDIA GeForce RTX 3080', 'NVIDIA GeForce RTX 3080 10GB, rendkívüli teljesítmény, ray tracing támogatással', 350000, 'Videókártya', 8704, 1710, 10, 320, '/kepek/x.png'),
        new GPU(2, 'AMD Radeon RX 6800 XT', 'AMD Radeon RX 6800 XT 16GB, nagy teljesítményű GPU, 4K gaming és ray tracing támogatás', 400000, 'Videókártya', 4608, 2250, 16, 300, '/kepek/x.png')
      ],
      Tápegység: [
        new PSU(1, 'CORSAIR RM850x', '850W teljesítmény, moduláris, 80+ Gold tanúsítvány, csendes működés', 29000, 'Tápegység', 850, '80+ Gold', 'Silent', '/kepek/x.png'),
        new PSU(2, 'Seasonic Focus GX-750', '750W teljesítmény, moduláris, 80+ Gold tanúsítvány, rendkívül megbízható', 26000, 'Tápegység', 750, '80+ Gold', 'Low Noise', '/kepek/x.png')
      ],

    };

    return mockProducts[category] || [];
  }

  selectProduct(product: any) {
    this.productSelected.emit(product);
  }

  get isCategorySelected() {
    return this.category !== null && this.category !== '';
  }
}
