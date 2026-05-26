import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import { ClientesService } from './services/clientes.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-clientes',
  standalone: true,
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    ButtonModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Clientes {
  data!: FormGroup;
  data_proveedor: any[] = [];
  fecha_actual?: string;
  date: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private message: MessageService,
    private cliente: ClientesService
  ) { }

  ngOnInit(): void {
    this.data = this.fb.group({
      cedula: ['', Validators.required],
      nombre_cliente: ['', Validators.required],
      telefono: ['', Validators.required],
    });
    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm:ss');
  }

  on_enter_cedula_cliente(event: any) {
    if (event.code == "Enter") {
      const nextElement = (document.querySelector(`[formControlName="nombre_cliente"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  on_enter_nombre_cliente(event: any) {
    if (event.code == "Enter") {
      const nextElement = (document.querySelector(`[formControlName="telefono"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  funct_registra_clientes_c() {
    this.cliente.funct_registra_clientes_s(this.data.value).subscribe({
      next: (data: any) => {
        const obj = JSON.stringify(data);
        const obj2 = JSON.parse(obj);
        if (obj2.status != 409) {
          this.data.get('cedula')?.setValue('');
          this.data.get('nombre_cliente')?.setValue('');
          this.data.get('telefono')?.setValue('');
          this.message.add({ severity: 'info', summary: 'Informativo:', detail: 'Cliente registrado exitosamente', life: 3000 });
          const nextElement = (document.querySelector(`[formControlName="cedula"]`) as HTMLElement);
          nextElement.focus();
        } else {
          this.message.add({ severity: 'error', summary: 'Error:', detail: obj2.msg, life: 3000 });
        }
      }
    })
  }
}
