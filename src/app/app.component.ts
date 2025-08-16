import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'proyectoEstadias';
  menuVisible = false;
  esAdmin = false; // Por defecto nadie es admin
  cargando = true;  // Para esperar a que Firebase cargue

  constructor(private auth: Auth) {}

  ngOnInit() {
    // Verifica si hay usuario logueado y si es admin
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // Aquí definimos de manera sencilla si el correo es admin
        // Cambia esto según tu lógica real de admins
        if (user.email === 'admin@email.com') {
          this.esAdmin = true;
        } else {
          this.esAdmin = false;
        }
      } else {
        this.esAdmin = false;
      }
      this.cargando = false; // Ya cargó la info del usuario
    });
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
}
