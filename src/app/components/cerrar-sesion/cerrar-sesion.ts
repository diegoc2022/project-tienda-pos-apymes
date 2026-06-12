import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-cerrar-sesion',
  standalone: true,
  templateUrl: './cerrar-sesion.html',
  styleUrls: ['./cerrar-sesion.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class CerrarSesion {
  constructor(
    private router: Router,
    private message: MessageService

  ) { }

  functCerrarSesion() {
    this.message.add({ severity: 'succes', summary: 'Info:', detail: 'Sesion cerrada exitosamente', life: 5000 });
    setTimeout(() => {
      localStorage.clear();
      this.router.navigate(['/']);
      //window.location.reload();
    }, 1000);
  }
}
