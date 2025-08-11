import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  standalone: false,
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  formulario: FormGroup;
  registroExitoso = false;
  datos: any = {};
  evento: string = "";

  constructor(private fb: FormBuilder, private firestore: Firestore, private route: ActivatedRoute) {
    this.formulario = this.fb.group({
      nombreEvento: [{ value: '', disabled: true }],
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
    this.evento = this.route.snapshot.paramMap.get('evento') || 'general';

    try {
      const docRef = doc(this.firestore, 'configuracion', this.evento.toLowerCase());
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const config = snapshot.data();
        this.formulario.patchValue({
          nombreEvento: config['nombreEvento'] || this.evento,
          costo: `$${config['costo']}` || ''
        });
      } else {
        // Si no existe el evento, usa el documento 'general' como respaldo
        const generalRef = doc(this.firestore, 'configuracion', 'general');
        const generalSnap = await getDoc(generalRef);

        if (generalSnap.exists()) {
          const general = generalSnap.data();
          this.formulario.patchValue({
            nombreEvento: general['nombreEvento'] || 'Evento',
            costo: `$${general['costo']}` || '$100'
          });
        }
      }
    } catch (error) {
      console.error('Error al obtener configuración desde Firestore:', error);
    }
  }

  async registrarUsuario() {
    if (this.formulario.valid) {
      this.datos = this.formulario.getRawValue();
      this.datos.orden = this.generarNumeroOrden();
      this.datos.referencia = this.generarReferencia();
      this.registroExitoso = true;

      try {
        const usuariosRef = collection(this.firestore, 'usuarios');
        await addDoc(usuariosRef, this.datos);
        console.log('✅ Datos guardados en Firebase:', this.datos);
      } catch (error) {
        console.error('❌ Error al guardar en Firebase:', error);
      }
    } else {
      this.formulario.markAllAsTouched();
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
