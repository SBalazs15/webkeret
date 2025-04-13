import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard, MatCardActions, MatCardTitle} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    MatCard,
    MatCardTitle,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatCardActions,
    MatButton
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileForm: FormGroup;
  editMode = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      username: [{ value: 'janedoe', disabled: true }, Validators.required],
      name: [{ value: 'Jane Doe', disabled: true }, Validators.required],
      email: [{ value: 'jane@example.com', disabled: true }, [Validators.required, Validators.email]],
      dob: [{ value: '1995-04-10', disabled: true }],
      password: [''],
      confirmPassword: ['']
    });
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
    if (this.profileForm.valid) {
      console.log('Mentett adatok:', this.profileForm.value);
      this.editMode = false;
      this.profileForm.get('name')?.disable();
      this.profileForm.get('email')?.disable();
      this.profileForm.get('username')?.disable();
      this.profileForm.get('password')?.reset();
      this.profileForm.get('confirmPassword')?.reset();
    }
  }

  deleteProfile() {
    // ide jöhet majd megerősítés (confirm dialog)
    console.log('Profil törölve!');
  }

  cancelEdit() {
    this.editMode = false;

    this.profileForm.reset({
      username: { value: 'janedoe', disabled: true },
      name: { value: 'Jane Doe', disabled: true },
      email: { value: 'jane@example.com', disabled: true },
      dob: { value: '1995-04-10', disabled: true },
      password: '',
      confirmPassword: ''
    });

    this.profileForm.get('password')?.clearValidators();
    this.profileForm.get('confirmPassword')?.clearValidators();
    this.profileForm.get('password')?.updateValueAndValidity();
    this.profileForm.get('confirmPassword')?.updateValueAndValidity();
  }
}
