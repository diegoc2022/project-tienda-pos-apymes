import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../clientes/services/clientes.service';
import { MessageService } from 'primeng/api';
import { PagosConsumosServices } from '../pagos-consumos/services/pagos-consumos.services';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { AperturaInventarioService } from '../apertura-inventario/services/apertura-inventario.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { InventarioActualService } from '../inventario-actual/services/inventario-actual.service';
import { InventarioService } from '../inventario/services/inventario.service';

@Component({
  selector: 'app-consultar-inventario',
  standalone: true,
  templateUrl: './consultar-inventario.html',
  styleUrl: './consultar-inventario.scss',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    TableModule,
    CommonModule,
    InputNumberModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultarInventario {
  data: FormGroup = new FormGroup({});
  data2: FormGroup = new FormGroup({});
  date: Date | undefined;
  codigo_venta: number = 0;
  ventas: any[] = [];
  inventario_actual: any[] = [];
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
    private message: MessageService,
    private cdr: ChangeDetectorRef,
    private apert_inv: AperturaInventarioService,
    private inv_actual: InventarioActualService,
    private inventario: InventarioService
  ) { }

  ngOnInit() {
    this.data = this.fb.group({
      nombre_tipo: ['', Validators.required],
      id_invent: [null, Validators.required]
    });
    this.funct_retorna_id_inventario();
  }

  opciones = [
    { label: 'Stock completo', value: '1-SC' },
    { label: 'Ajuste por vencimiento', value: '2-APV' },
    { label: 'Ajuste por daños', value: '3-APD' },
    { label: 'Ajuste por robo', value: '4-APR' },
    { label: 'Ajuste por diferencias', value: '5-AD' }
  ];

  funct_retorna_id_inventario() {
    this.apert_inv.funct_retorna_id_inventario().subscribe({
      next: (data: any) => {
        setTimeout(() => {
          const id = Number(data[0].id_inventario);
          this.data.get('id_invent')?.setValue(id);
        }, 1000)
        this.cdr.detectChanges();
      }
    })
  }


  funct_retorna_inventario_actual() {
    if (this.data.invalid) {
      this.data.markAllAsTouched();
      for (const key in this.data.controls) {
        this.data.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'warn', summary: 'Error:', detail: 'El campo tipo es requerido' });
      return;
    }

    this.inventario.funct_retorna_inventario_x_id(this.data.value.id_invent, this.data.value.nombre_tipo).subscribe({
      next: (data: any) => {
        this.inventario_actual = [];
        for (let index = 0; index < data.length; index++) {
          this.inventario_actual.push(data[index]);
        }
        this.cdr.detectChanges();
      }
    })
  }

  funct_reset_formulario(event: any) {
    this.inventario_actual = [];
  }
}
