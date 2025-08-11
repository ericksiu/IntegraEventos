import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './pages/formulario/formulario.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginAdminComponent } from './pages/login-admin/login-admin.component';
import { AdminComponent } from './pages/admin/admin.component';


const rutas: Routes = [
  { path: 'login-admin',
     component: LoginAdminComponent 
  },   
  { path: 'admin', 
    component: AdminComponent 
  },
  {path:'inicio',
    component:InicioComponent
  },
  {path:'formulario/:evento',
    component:FormularioComponent
  },
   {path:'formulario',
    component:FormularioComponent
  },
{ path: '**', redirectTo: '/inicio' },
  
];

@NgModule({
  imports:[
    RouterModule.forRoot(rutas)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
