import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { AperturaCajaService } from './services/apertura-caja.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apertura-caja',
  standalone: true,
  templateUrl: './apertura-caja.html',
  styleUrl: './apertura-caja.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    InputNumberModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AperturaCaja {
  formId: FormGroup = new FormGroup({});
  date: Date = new Date();
  fecha_actual: any = '';
  id_apertura: number = 0;
  user: any;


  constructor(
    private messageService: MessageService,
    private apertura: AperturaCajaService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.formId = this.fb.group({
      base: [null, Validators.required]
    });
    this.fecha_actual = localStorage.getItem('fecha_apertura');
    this.user = localStorage.getItem('user');
  }

  funcAperturaCaja() {
    this.apertura.funct_retorna_apertura_caja(this.user).subscribe({
      next: (data: any) => {
        const obj = JSON.parse(JSON.stringify(data));
        const id_caja = Number(obj.id_caja) + 1
        const id = Number(obj.id)

        this.apertura.funct_apertura_caja(id, id_caja, this.formId.value.base).subscribe({
          next: (obj: any) => {
            const data = JSON.parse(JSON.stringify(obj));
            this.fecha_actual = '';
            this.fecha_actual = data.fecha_registro.substring(0, 10)
            localStorage.setItem('id_caja', data.id_caja);
            localStorage.setItem('fecha_apertura', this.fecha_actual);
            this.formId.setValue({ base: 0 });
            this.messageService.add({ severity: 'success', summary: 'Informativo:', detail: 'Se ha creado nueva caja con id: ' + data.id });
            setTimeout(() => {
              this.router.navigate(['/menu/facturar']);
            }, 1000)
          }
        })
      }
    })

  }
}
