import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  usuarios: any[] = [];
  actividades: any[] = [];
  configForm: FormGroup;
  paginaActual: number = 1;
  usuariosPorPagina: number = 15;

    get usuariosPaginados() {
      const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
      return this.usuarios.slice(inicio, inicio + this.usuariosPorPagina);
    }

    get totalPaginas(): number {
      return Math.ceil(this.usuarios.length / this.usuariosPorPagina);
    }

    // Métodos para cambiar página
    paginaAnterior() {
      if (this.paginaActual > 1) this.paginaActual--;
    }

    paginaSiguiente() {
      if (this.paginaActual < this.totalPaginas) this.paginaActual++;
    }

 

  constructor(private firestore: Firestore, private fb: FormBuilder) {
    this.configForm = this.fb.group({
      nombreEvento: ['', Validators.required],
      costo: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.obtenerUsuarios();
    await this.obtenerActividades();
  }

  /** Obtener usuarios registrados */
  async obtenerUsuarios() {
    const usuariosRef = collection(this.firestore, 'usuarios');
    const querySnapshot = await getDocs(usuariosRef);
    this.usuarios = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  /** Obtener todas las actividades (general, ciclismo, kayaks, senderismo) */
  async obtenerActividades() {
    const actividadesRef = collection(this.firestore, 'configuracion');
    const querySnapshot = await getDocs(actividadesRef);
    this.actividades = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  /** Guardar cambios en una actividad específica */
  async guardarCambios(actividad: any) {
    const ref = doc(this.firestore, 'configuracion', actividad.id);
    try {
      await updateDoc(ref, {
        nombreEvento: actividad.nombreEvento,
        costo: actividad.costo
      });
      alert(`✅ Cambios guardados en ${actividad.id}`);
    } catch (e) {
      alert('❌ Error al guardar los cambios');
    }
  }
}


