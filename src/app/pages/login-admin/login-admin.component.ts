import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  standalone: false,
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  loginForm: FormGroup;
  error = '';
  mostrando = false;
 
  titulo = 'Inicio de sesión (Administrador)';
  botonTexto = 'Entrar';
  mostrarTexto = 'Mostrar';

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  toggleMostrar() {
    this.mostrando = !this.mostrando;
    this.mostrarTexto = this.mostrando ? 'Ocultar' : 'Mostrar';
  }

  async login() {
    if (this.loginForm.invalid) return;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    try {
      
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/admin']); // Redirige a la zona de administradores
    } catch (err: any) {
      this.error = 'Correo o contraseña incorrectos';
    }
    }
  }
