import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  standalone: false,
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  formulario: FormGroup;
  listaEventos: any[] = [];
  registroExitoso = false;
  datos: any = {};

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private route: ActivatedRoute
  ) {
    this.formulario = this.fb.group({
      nombreEvento: ['', Validators.required],
      distancia: ['', Validators.required],
      talla: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nacimiento: ['', Validators.required],
      curp: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      genero: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      telEmergencia: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      tipoSangre: ['', Validators.required],
      domicilio: ['', Validators.required],
      ciudad: ['', Validators.required],
      estado: ['', Validators.required],
      equipo: ['', Validators.required],
      costo: [{ value: '', disabled: true }]
    });
  }

  async ngOnInit() {
  await this.cargarEventos();
  const eventoUrl = this.route.snapshot.paramMap.get('evento');
  if (eventoUrl) {
    this.formulario.get('nombreEvento')?.setValue(eventoUrl);
    const eventoEncontrado = this.listaEventos.find(ev => ev.nombreEvento.toLowerCase() === eventoUrl.toLowerCase());
    if (eventoEncontrado) {
      this.formulario.get('costo')?.setValue(`$${eventoEncontrado.costo}`);
    }
  }

  this.formulario.get('nombreEvento')?.valueChanges.subscribe(valor => {
    const evento = this.listaEventos.find(ev => ev.nombreEvento.toLowerCase() === valor.toLowerCase());
    if (evento) {
      this.formulario.get('costo')?.setValue(`$${evento.costo}`);
    } else {
      this.formulario.get('costo')?.setValue('');
    }
  });
}

  async cargarEventos() {
    try {
      const eventosRef = collection(this.firestore, 'configuracion');
      const snapshot = await getDocs(eventosRef);
      this.listaEventos = snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  }

  descargarPDF() {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Registro de Carrera', 105, 15, { align: 'center' });
    doc.setDrawColor(0);
    doc.line(20, 20, 190, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${this.datos.nombre} ${this.datos.apellido}`, 20, 30);
    doc.text(`Evento: ${this.datos.nombreEvento}`, 20, 38);
    doc.text(`Distancia: ${this.datos.distancia}`, 20, 46);
    doc.text(`Número de Orden: ${this.datos.orden}`, 20, 54);
    doc.text(`Referencia de Pago: ${this.datos.referencia}`, 20, 62);
    doc.line(20, 70, 190, 70);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Gracias por tu inscripción.', 105, 80, { align: 'center' });
    doc.save(`registro_${this.datos.nombre}.pdf`);
  }

async registrarUsuario() {
  if (this.formulario.invalid) {
    this.formulario.markAllAsTouched();
    return;
  }

  const datosForm = this.formulario.getRawValue();

  try {
    const usuariosRef = collection(this.firestore, 'usuarios');
    const snapshot = await getDocs(usuariosRef);

    const yaRegistrado = snapshot.docs.some(doc => {
      const data = doc.data() as any;
      return data.email === datosForm.email &&
             data.nombreEvento.toLowerCase() === datosForm.nombreEvento.toLowerCase();
    });

    if (yaRegistrado) {
      alert('Ya estás inscrito en este evento. No puedes registrarte de nuevo.');
      return;
    }
    this.datos = datosForm;
    this.datos.orden = this.generarNumeroOrden();
    this.datos.referencia = this.generarReferencia();
    this.registroExitoso = true;
    await addDoc(usuariosRef, this.datos);

    this.descargarPDF();

    alert('Registro exitoso ✅');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    alert('Hubo un error al registrar. Intenta nuevamente.');
  }
}


  calcularEdad(fecha: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  generarNumeroOrden(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generarReferencia(): string {
    return 'REF-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
