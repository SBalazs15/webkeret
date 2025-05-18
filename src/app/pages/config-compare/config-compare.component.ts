import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Build } from '../../../model/build';
import { BuildDisplay } from '../../../model/display';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import {
  MatFormField,
  MatInput,
  MatLabel
} from '@angular/material/input';
import {KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import { MatButton } from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatDivider} from '@angular/material/list';

@Component({
  standalone: true,
  selector: 'app-config-compare',
  imports: [
    MatCheckbox,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    NgForOf,
    NgIf,
    MatFormField,
    MatButton,
    MatDivider,
    MatCardTitle,
    MatCard,
    MatCardContent,
    KeyValuePipe,
    NgStyle,
    NgClass
  ],
  templateUrl: './config-compare.component.html',
  styleUrl: './config-compare.component.css'
})
export class ConfigCompareComponent implements OnInit {
  builds$: Observable<BuildDisplay[]> = of([]);
  filteredListLeft: BuildDisplay[] = [];
  filteredListRight: BuildDisplay[] = [];
  ownBuilds: Build[] = [];
  publicBuilds: Build[] = [];
  userId: string | null = null;

  searchQueryLeft = '';
  searchQueryRight = '';
  selectedLeft: string = '';
  selectedRight: string = '';
  showOnlyOwn = false;
  showComparison = false;

  // ** Új változók a kiválasztott build objektumok tárolására **
  selectedBuildLeft: BuildDisplay | null = null;
  selectedBuildRight: BuildDisplay | null = null;

  // Az összes build egy helyen (hasznos az összehasonlításhoz)
  allBuilds: Build[] = [];

  constructor(private auth: Auth, private firestore: Firestore) {}

  async ngOnInit() {
    await this.loadOwnBuilds();
    await this.loadPublicBuildsExcludingOwn();

    this.allBuilds = [...this.ownBuilds, ...this.publicBuilds];

    const withDisplayName: BuildDisplay[] = this.allBuilds.map(b => ({
      ...b,
      displayName: b.uid === this.userId ? `Saját: ${b.buildName}` : b.buildName
    }));

    this.filteredListLeft = withDisplayName;
    this.filteredListRight = withDisplayName;
  }

  async loadOwnBuilds() {
    const user = await this.auth.currentUser;
    if (!user) return;

    this.userId = user.uid;

    const buildsRef = collection(this.firestore, 'Builds');
    const ownQuery = query(buildsRef, where('uid', '==', user.uid));
    const snapshot = await getDocs(ownQuery);
    this.ownBuilds = snapshot.docs.map(doc => doc.data() as Build);
  }

  async loadPublicBuildsExcludingOwn() {
    const buildsRef = collection(this.firestore, 'Builds');
    const publicQuery = query(buildsRef, where('puBlic', '==', true));
    const snapshot = await getDocs(publicQuery);

    const allPublic = snapshot.docs.map(doc => doc.data() as Build);

    this.publicBuilds = this.userId
      ? allPublic.filter(b => b.uid !== this.userId)
      : allPublic;
  }

  onSelectLeft(event: any) {
    this.selectedLeft = event.option.value;
    this.searchQueryLeft = this.selectedLeft;
  }

  onSelectRight(event: any) {
    this.selectedRight = event.option.value;
    this.searchQueryRight = this.selectedRight;
  }

  resetSelection(side: 'left' | 'right') {
    if (side === 'left') {
      this.selectedLeft = '';
      this.searchQueryLeft = '';
      this.selectedBuildLeft = null;
    } else {
      this.selectedRight = '';
      this.searchQueryRight = '';
      this.selectedBuildRight = null;
    }
  }

  filterBuilds() {
    if (this.showOnlyOwn && this.userId) {
      this.filteredListLeft = this.ownBuilds.map(b => ({
        ...b,
        displayName: `Saját: ${b.buildName}`
      }));
      this.filteredListRight = this.filteredListLeft;
    } else {
      this.allBuilds = [...this.ownBuilds, ...this.publicBuilds];
      const withDisplayName: BuildDisplay[] = this.allBuilds.map(b => ({
        ...b,
        displayName: b.uid === this.userId ? `Saját: ${b.buildName}` : b.buildName
      }));
      this.filteredListLeft = withDisplayName;
      this.filteredListRight = withDisplayName;
    }
  }

  // ** Új metódus az összehasonlítás gombhoz **
  onCompareClick() {
    this.selectedBuildLeft = this.filteredListLeft.find(b => b.displayName === this.selectedLeft) ?? null;
    this.selectedBuildRight = this.filteredListRight.find(b => b.displayName === this.selectedRight) ?? null;
    this.showComparison = true;
  }

  isMapEmpty(mapOrObj: Map<any, any> | object | undefined): boolean {
    if (!mapOrObj) {
      return true;
    }

    // Ha Map típus
    if (mapOrObj instanceof Map) {
      return mapOrObj.size === 0;
    }

    // Ha sima objektum
    if (typeof mapOrObj === 'object') {
      return Object.keys(mapOrObj).length === 0;
    }

    return true; // egyébként üresnek vesszük
  }




}
