import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  standalone: false,
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  imagenActual = 0;
  imagenes: any[] = [];
  cargando = true;

  get imagenActualObj() {
    return this.imagenes[this.imagenActual];
  }

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const ref = collection(this.firestore, 'configuracion');
    const snapshot = await getDocs(ref);

    this.imagenes = snapshot.docs.map(doc => ({
      ...doc.data(),
      evento: doc.id
    }));

    this.cargando = false;
  }

  siguiente() {
    this.imagenActual = (this.imagenActual + 1) % this.imagenes.length;
  }

  anterior() {
    this.imagenActual = (this.imagenActual - 1 + this.imagenes.length) % this.imagenes.length;
  }
}
