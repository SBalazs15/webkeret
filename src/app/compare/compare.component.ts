import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-compare',
  imports: [
    MatButton,
    RouterLink
  ],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css'
})
export class CompareComponent {

}
