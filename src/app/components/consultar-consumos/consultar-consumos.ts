import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ClientesService } from '../clientes/services/clientes.service';
import { PagosConsumosServices } from '../pagos-consumos/services/pagos-consumos.services';

@Component({
  selector: 'app-consultar-consumos',
  standalone: true,
  templateUrl: './consultar-consumos.html',
  styleUrl: './consultar-consumos.scss',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    TableModule,
    CommonModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultarConsumos {
  data: FormGroup = new FormGroup({});
  data2: FormGroup = new FormGroup({});
  clientes: any[] = [];
  date: Date | undefined;
  codigo_venta: number = 0;
  ventas: any[] = [];
  productos: any[] = [];
  selectedProduct2: any;
  cedula: any;
  nombre: string = '';
  monto_total: number = 0;
  pagos: number = 0;
  monto_restante: number = 0;
  estado: string = '';
  tipo_pago: any[] = [];
  monto_pagos: any[] = [];
  seleccionado: any = null;
  seleccionado2: any = null;
  num_pagos: number = 0;
  saldo_restante: number = 0;

  constructor(
    private fb: FormBuilder,
    private r_cliente: ClientesService,
    private message: MessageService,
    private pagos_c: PagosConsumosServices,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.data = this.fb.group({
      cliente: ['', Validators.required],
      codigo_venta: ['', Validators.required]
    });
    this.funct_retorna_clientes_c();
  }

  funct_retorna_clientes_c() {
    this.r_cliente.funct_retorna_clientes_s().subscribe({
      next: (data: any) => {
        this.clientes = [];
        for (let index = 0; index < data.length; index++) {
          this.clientes.push(data[index]);
        }
      }
    })
  }

  funct_retorna_one_cliente_c(data: any) {
    if (data.value != null) {
      this.r_cliente.funct_retorna_one_cliente(data.value).subscribe({
        next: (data: any) => {
          this.productos = [];
          for (let index = 0; index < data.length; index++) {
            this.codigo_venta = data[index].codigo_venta;
            this.nombre = data[index].nombre;
            this.cedula = data[index].codigo_cliente;
            this.data.get('codigo_venta')?.setValue(parseInt(data[index].codigo_venta));
          }
        }
      })
    } else {
      this.data.get('codigo_venta')?.setValue(parseInt(''));
    }
  }

  funct_consuta_ventas_x_cliente() {
    if (this.data.invalid) {
      this.data.markAllAsTouched();
      for (const key in this.data.controls) {
        this.data.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'warn', summary: 'Error:', detail: 'El campo cliente es requerido' });
      return;
    }

    this.pagos_c.funct_consulta_ventas_x_cliente(this.data.value).subscribe({
      next: (data: any) => {
        this.productos = [];
        this.monto_total = 0;
        if (data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            this.monto_total += data[index].subtotal;
            this.productos.push(data[index]);
          }
          this.cdr.detectChanges();
        } else {
          this.message.add({ severity: 'warn', summary: 'Error:', detail: 'Este cliente aún no tiene consumo registrado con este id ventas: ' + this.data.value.codigo_venta, life: 5000 });
        }

      }
    })
  }
}
