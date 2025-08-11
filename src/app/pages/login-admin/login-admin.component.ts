import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  loginForm: FormGroup;
  error: string = '';
  creandoAdmin: boolean = false;
  mostrar: boolean=false; 

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async login() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    if (this.creandoAdmin) {
      // Registrar nuevo administrador
      try {
        await createUserWithEmailAndPassword(this.auth, email, password);
        this.router.navigate(['/admin']);
      } catch (err: any) {
        this.error = this.getFirebaseErrorMessage(err.code);
      }
    } else {
      // Iniciar sesión
      try {
        await signInWithEmailAndPassword(this.auth, email, password);
        this.router.navigate(['/admin']);
      } catch (err: any) {
        this.error = this.getFirebaseErrorMessage(err.code);
      }
    }
  }

  toggleModo() {
    this.creandoAdmin = !this.creandoAdmin;
    this.error = '';
  }

 private getFirebaseErrorMessage(code: string): string {
  if (!code) return 'Ocurrió un error inesperado.';

  switch (code.toLowerCase()) {
    case 'auth/user-not-found':
      return 'Usuario no registrado.';
    case 'auth/wrong-password':
      return 'La contraseña es incorrecta.';
    case 'auth/invalid-email':
      return 'Correo electrónico inválido.';
    case 'auth/email-already-in-use':
      return 'El correo ya está registrado.';
    case 'auth/missing-password':
      return 'Falta la contraseña.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/invalid-login-credentials':
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Intenta más tarde.';
    case 'auth/network-request-failed':
      return 'Error de red. Revisa tu conexión.';
    default:
      return `Ocurrió un error inesperado. Código: ${code}`;
  }
}

}
