import { Component } from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCard, MatCardContent, MatCardImage, MatCardTitle} from '@angular/material/card';
import {NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardImage,
    NgForOf,
    RouterLink,
    MatButton,
    NgIf
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    {
      title: 'Egyszerű kiválasztás',
      description: 'Válaszd ki az alkatrészeket kategóriánként.',
      image: '/kepek/x.png'
    },
    {
      title: 'Valós idejű előnézet',
      description: 'Azonnal látod a kiválasztott alkatrészek részleteit.',
      image: '/kepek/x.png'
    },
    {
      title: 'Teljes kompatibilitás',
      description: 'Figyelmeztet, ha valami nem passzol össze.',
      image: '/kepek/x.png'
    }
  ];
}
