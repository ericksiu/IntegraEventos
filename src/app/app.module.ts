import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormularioComponent } from './pages/formulario/formulario.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { LoginAdminComponent } from './pages/login-admin/login-admin.component';
import { AdminComponent } from './pages/admin/admin.component';

import { provideAuth, getAuth } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AppComponent,
    FormularioComponent,
    InicioComponent,
    LoginAdminComponent,
    AdminComponent
  ],
  imports: [
    
    FormsModule,
    
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
