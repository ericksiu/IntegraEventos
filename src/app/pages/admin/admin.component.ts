import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth'; // <--- importar Auth

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  usuarios: any[] = [];
  actividades: any[] = [];
  configForm: FormGroup;

  // -------------------- NUEVO ADMIN --------------------
  nuevoAdminForm: FormGroup;
  errorAdmin = '';
  successAdmin = '';
  mostrando = false;
  mostrarTexto = 'Mostrar';

  paginaActual: number = 1;
  usuariosPorPagina: number = 15;

  constructor(private firestore: Firestore, private fb: FormBuilder, private auth: Auth) {
    // Formulario simple para agregar eventos
    this.configForm = this.fb.group({
      nombreEvento: ['', Validators.required],
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      costo: [null, [Validators.required, Validators.min(0)]],
      url: ['', Validators.required]
    });

    // Formulario para crear nuevo administrador
    this.nuevoAdminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarActividades();

  }

  // -------------------- PAGINACIÓN --------------------
  get usuariosPaginados() {
    const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
    return this.usuarios.slice(inicio, inicio + this.usuariosPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.usuarios.length / this.usuariosPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  // -------------------- CARGAR DATOS --------------------
  async cargarUsuarios() {
    const usuariosRef = collection(this.firestore, 'usuarios');
    const snapshot = await getDocs(usuariosRef);
    this.usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async cargarActividades() {
    const actividadesRef = collection(this.firestore, 'configuracion');
    const snapshot = await getDocs(actividadesRef);
    this.actividades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // -------------------- AGREGAR EVENTO --------------------
  async agregarEvento() {
    if (this.configForm.invalid) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const { nombreEvento, title, subtitle, costo, url } = this.configForm.value;
    const idEvento = nombreEvento.trim().toLowerCase().replace(/\s+/g, '-');

    const nuevoEvento = {
      nombreEvento: nombreEvento.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      costo: Number(costo),
      url: url.trim()
    };

    try {
      await setDoc(doc(this.firestore, 'configuracion', idEvento), nuevoEvento);
      alert('Evento agregado con éxito');
      this.configForm.reset();
      this.cargarActividades();
    } catch (error) {
      console.error(error);
      alert('Error al agregar evento');
    }
  }

  // -------------------- GUARDAR CAMBIOS --------------------
  async guardarCambios(actividad: any) {
    if (!actividad.nombreEvento || actividad.costo == null) {
      alert('El nombre y el costo son obligatorios.');
      return;
    }

    const ref = doc(this.firestore, 'configuracion', actividad.id);
    try {
      await updateDoc(ref, {
        nombreEvento: actividad.nombreEvento,
        title: actividad.title || '',
        subtitle: actividad.subtitle || '',
        costo: Number(actividad.costo),
        url: actividad.url || ''
      });
      alert('Cambios guardados');
      this.cargarActividades();
    } catch (error) {
      console.error(error);
      alert('Error al guardar cambios');
    }
  }

  // -------------------- ELIMINAR USUARIO --------------------
  async eliminarUsuario(usuario: any) {
    if (!confirm(`¿Seguro que quieres eliminar al usuario "${usuario.nombre}"?`)) return;

    try {
      await deleteDoc(doc(this.firestore, 'usuarios', usuario.id));

      // Quitarlo de la lista en memoria sin recargar de Firestore
      this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);

      alert('Usuario eliminado');
    } catch (error) {
      console.error(error);
      alert('Error al eliminar usuario');
    }
  }

  // -------------------- ELIMINAR EVENTO --------------------
  async eliminarEvento(actividad: any) {
    if (!confirm(`¿Seguro que quieres eliminar "${actividad.nombreEvento}"?`)) return;

    try {
      await deleteDoc(doc(this.firestore, 'configuracion', actividad.id));
      alert('Evento eliminado');
      this.cargarActividades();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar evento');
    }
  }

  // -------------------- NUEVO ADMINISTRADOR --------------------
  toggleMostrar() {
    this.mostrando = !this.mostrando;
    this.mostrarTexto = this.mostrando ? 'Ocultar' : 'Mostrar';
  }

  async crearAdmin() {
    if (this.nuevoAdminForm.invalid) return;

    const email = this.nuevoAdminForm.value.email;
    const password = this.nuevoAdminForm.value.password;

    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.successAdmin = 'Administrador creado con éxito';
      this.errorAdmin = '';
      this.nuevoAdminForm.reset();
    } catch (err: any) {
      this.errorAdmin = 'Error al crear administrador: ' + (err.message || err.code);
      this.successAdmin = '';
    }
  }

}
