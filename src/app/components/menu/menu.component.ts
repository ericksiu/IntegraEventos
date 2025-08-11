import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
rutas=[
  {name:'Inicio',
    path:'/inicio'
  },
  {name:'Formulario',
    path:'/formulario'
  },

]
ngOnInit(): void{}
}
