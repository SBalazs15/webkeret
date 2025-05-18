import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Firestore, doc, getDoc, deleteDoc, updateDoc } from '@angular/fire/firestore'; // Importáljuk a deleteDoc metódust
import { Auth } from '@angular/fire/auth'; // Az Auth modul importálása
import { Observable, from } from 'rxjs';
import { User } from '../../model/user';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatCard, MatCardActions, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { updateEmail,updatePassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    MatFormField,
    MatCard,
    MatCardTitle,
    ReactiveFormsModule,
    MatInput,
    MatCardActions,
    MatButton,
    NgIf,
    MatFormFieldModule,
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  editMode = false;
  currentUser: Observable<User | null> | undefined;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private authService: AuthService,
    private auth: Auth,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      dob: [{ value: '', disabled: true }],
      password: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    const currentFirebaseUser = this.auth.currentUser;

    if (currentFirebaseUser) {
      const userRef = doc(this.firestore, `Users/${currentFirebaseUser.uid}`);
      getDoc(userRef).then(docSnapshot => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as User;
          console.log(currentFirebaseUser.email)

          this.profileForm.patchValue({
            username: userData.uname,
            name: userData.name,
            email: userData.email,
            dob: userData.bday
          });
        } else {
          console.log('Felhasználó nem található a Firestore-ban');
        }
      }).catch(error => {
        console.error('Hiba az adatok lekérésekor:', error);
      });
    } else {
      console.error('Nincs bejelentkezett felhasználó');
    }
  }


  enableEditing() {
    this.editMode = true;
    this.profileForm.get('name')?.enable();
    this.profileForm.get('email')?.enable();
    this.profileForm.get('username')?.enable();
    this.profileForm.get('password')?.setValidators([Validators.minLength(6)]);
    this.profileForm.get('confirmPassword')?.setValidators([Validators.minLength(6)]);
  }

  saveChanges() {
    if (!this.profileForm.valid) return;

    this.errorMessage = null;
    this.successMessage = null;

    const currentFirebaseUser = this.auth.currentUser;

    if (currentFirebaseUser) {
      const updatedEmail = this.profileForm.get('email')?.value;
      const newPassword = this.profileForm.get('password')?.value;
      const confirmPassword = this.profileForm.get('confirmPassword')?.value;

      if (newPassword && newPassword !== confirmPassword) {
        this.errorMessage = 'A két jelszó nem egyezik meg.';
        return;
      }

      const updatedData = {
        name: this.profileForm.get('name')?.value,
        uname: this.profileForm.get('username')?.value,
        email: updatedEmail
      };

      const userRef = doc(this.firestore, `Users/${currentFirebaseUser.uid}`);

      updateDoc(userRef, updatedData)
        .then(() => {
          const promises = [];

          if (updatedEmail !== currentFirebaseUser.email) {
            promises.push(updateEmail(currentFirebaseUser, updatedEmail));
          }

          if (newPassword) {
            promises.push(updatePassword(currentFirebaseUser, newPassword));
          }

          return Promise.all(promises);
        })
        .then(() => {
          this.successMessage = 'A profil sikeresen frissült.';
          this.editMode = false;
          this.profileForm.disable();
          this.profileForm.patchValue({ password: '', confirmPassword: '' });
        })
        .catch(error => {
          console.error('Hiba a mentés során:', error);
          this.errorMessage = this.getErrorMessage(error);
        });
    }
  }

  getErrorMessage(error: any): string {
    if (error.code === 'auth/requires-recent-login') {
      return 'Biztonsági okokból kérjük, jelentkezz be újra a módosításhoz.';
    }
    if (error.code === 'auth/operation-not-allowed') {
      return 'Az adott művelet nem engedélyezett.';
    }
    if (error.code === 'auth/email-already-in-use') {
      return 'Ez az email cím már használatban van.';
    }
    return 'Ismeretlen hiba történt.';
  }




  deleteProfile() {
    const currentFirebaseUser = this.auth.currentUser;

    if (currentFirebaseUser) {
      const userRef = doc(this.firestore, `Users/${currentFirebaseUser.uid}`);

      deleteDoc(userRef)
        .then(() => {
          return currentFirebaseUser.delete();
        })
        .then(() => {
          this.errorMessage = 'Felhasználó sikeresen törölve.';
          setTimeout(() => {
            this.authService.singOut();
          }, 2000);
        })
        .catch(error => {
          console.error('Hiba a törlés során:', error);
          this.errorMessage = 'Hiba történt a profil vagy fiók törlése során.';
        });
    } else {
      this.errorMessage = 'Nincs bejelentkezett felhasználó.';
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.ngOnInit();
  }
}
