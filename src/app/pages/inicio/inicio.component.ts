import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  imagenActual = 0;

  imagenes = [
  {
    url: 'assets/img/ciclismo.jpg',
    alt: 'Ciclismo de montaña',
    title: '¡Únete a la aventura del ciclismo!',
    title2: 'Ciclismo',
    subtitle: 'Regístrate y participa en eventos únicos al aire libre.',
    evento: 'ciclismo'
  },
  {
    url: 'assets/img/senderismo.jpg',
    alt: 'Senderismo en la montaña',
    title: 'Explora la naturaleza con senderismo',
    title2: 'Senderismo',
    subtitle: 'Eventos diseñados para todos los niveles y edades.',
    evento: 'senderismo'
  },
  {
    url: 'assets/img/kayaks.jpg',
    alt: 'Kayak en río',
    title: 'Desafía los ríos en kayak',
    title2: 'Kayaks',
    subtitle: 'Vive la emoción y naturaleza en Umécuaro.',
    evento: 'kayaks'
  }
];

  siguiente() {
    this.imagenActual = (this.imagenActual + 1) % this.imagenes.length;
  }

  anterior() {
    this.imagenActual = (this.imagenActual - 1 + this.imagenes.length) % this.imagenes.length;
  }
}
