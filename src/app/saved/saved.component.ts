import { Component, OnInit } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { Firestore, collection, collectionData, query, where, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, switchMap, of } from 'rxjs';
import { Build } from '../../model/build';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatList, MatListItem } from '@angular/material/list';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatFormFieldModule,
    MatInputModule,
    MatList,
    MatListItem,
    NgForOf,
    NgIf,
    AsyncPipe,
    MatFormField,
    MatInput,
    FormsModule,
    MatButton
  ],
  styleUrls: ['./saved.component.css']
})
export class SavedComponent implements OnInit {
  builds$: Observable<Build[]> | undefined;
  editingBuildId: number | null = null;
  newBuildName: string = '';

  constructor(private auth: Auth, private firestore: Firestore) {}

  ngOnInit() {
    this.builds$ = authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          const buildsCollection = collection(this.firestore, 'Builds');
          const q = query(buildsCollection, where('uid', '==', user.uid));
          return collectionData(q, { idField: 'id' }) as Observable<Build[]>;
        } else {
          return of([]);
        }
      })
    );
  }

  startEditing(buildId: number) {
    this.editingBuildId = buildId;
    this.newBuildName = '';
  }

  async saveBuildName(buildId: number) {
    if (!this.newBuildName.trim()) return;

    const buildDocRef = doc(this.firestore, 'Builds', buildId.toString());
    try {
      await updateDoc(buildDocRef, { buildName: this.newBuildName.trim() });
      this.editingBuildId = null;
      this.newBuildName = '';
    } catch (error) {
      console.error('Hiba a build név mentésekor:', error);
    }
  }

  cancelEditing() {
    this.editingBuildId = null;
    this.newBuildName = '';
  }

  async togglePublic(build: Build) {
    const buildDocRef = doc(this.firestore, 'Builds', build.id.toString());
    try {
      await updateDoc(buildDocRef, { puBlic: !build.puBlic });
    } catch (error) {
      console.error('Hiba a publikusság frissítésekor:', error);
      alert('Hiba történt a publikusság beállításakor.');
    }
  }
}
