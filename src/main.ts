import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { environment } from './app/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({ projectId: "buildcompare-37483",
      appId: "1:959499413579:web:91203ce6cc354ed82985ce",
      storageBucket: "buildcompare-37483.firebasestorage.app",
      apiKey: "AIzaSyAQt8bngGCFHa1cE3oxn97T0F3yxO5Pbt0",
      authDomain: "buildcompare-37483.firebaseapp.com",
      messagingSenderId: "959499413579" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
});
