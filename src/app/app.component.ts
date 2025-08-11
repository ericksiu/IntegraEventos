import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyectoEstadias';
 menuVisible = false;

toggleMenu() {
  this.menuVisible = !this.menuVisible;
}



}
