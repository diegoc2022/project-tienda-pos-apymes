import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ClientesService } from '../clientes/services/clientes.service';
import { PagosConsumosServices } from './services/pagos-consumos.services';
import { VentasSerivice } from '../form-ventas/services/ventas.serivice';
import { ImprimirService } from './services/imprimir.service';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-pagos-consumos',
  standalone: true,
  templateUrl: './pagos-consumos.html',
  styleUrl: './pagos-consumos.scss',
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
export class PagosConsumos implements OnInit {
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
    private cliente: ClientesService,
    private pagos_c: PagosConsumosServices,
    private message: MessageService,
    private ventas_c: VentasSerivice,
    private imprimeDetalle: ImprimirService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.data = this.fb.group({
      cliente: ['', Validators.required],
      codigo_venta: ['', Validators.required]
    });

    this.data2 = this.fb.group({
      valor_pago: ['0', Validators.required],
      cod_tipo_pago: [null, Validators.required]
    });

    this.tipo_pago = [
      { name: 'Pago parcial', code: 1 },
      { name: 'Pago total', code: 2 }
    ];

    this.funct_retorna_clientes_c();

  }

  funct_retorna_clientes_c() {
    this.cliente.funct_retorna_clientes_s().subscribe({
      next: (data: any) => {
        const objData = JSON.stringify(data);
        const obj = JSON.parse(objData);
        this.clientes = [];
        for (let index = 0; index < obj.length; index++) {
          this.clientes.push(obj[index]);
        }
      }
    })
  }

  funct_retorna_one_cliente_c(data: any) {
    if (data.value != null) {
      this.cliente.funct_retorna_one_cliente(data.value).subscribe({
        next: (datar: any) => {
          this.ventas.length = 0;
          for (let index = 0; index < datar.length; index++) {
            this.codigo_venta = datar[index].codigo_venta;
            this.nombre = datar[index].nombre;
            this.cedula = datar[index].codigo_cliente;
            this.data.get('codigo_venta')?.setValue(parseInt(datar[index].codigo_venta));
          }
        }
      })
    } else {
      this.data.get('codigo_venta')?.setValue(parseInt(''));
    }
  }

  funct_consulta_ventas_x_cliente() {
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
        this.ventas.length = 0;
        this.productos.length = 0;
        this.monto_total = 0;
        this.estado = '';

        for (let index = 0; index < data.length; index++) {
          this.estado = data[index].estado_venta;
          this.monto_total += data[index].subtotal;
          this.productos = [...data];
        }

        if (data.length == 0) {
          this.estado = 'SIN CONSUMO'
        }

        this.ventas = [{
          id_cliente: this.cedula,
          nombre: this.nombre,
          id_venta: this.codigo_venta,
          monto: this.monto_total,
          estado: this.estado
        }]

        this.pagos_c.funct_retorna_pagos_s(this.data.value).subscribe({
          next: (datap: any) => {
            this.pagos = 0;
            this.monto_restante = 0;
            this.num_pagos = datap.length;
            for (let index = 0; index < datap.length; index++) {
              this.pagos += datap[index].ultimo_pago_realizado;
            }
            this.monto_restante = this.monto_total - this.pagos;
            this.cdr.detectChanges();
          }
        })
      }
    })
  }

  funct_registra_pagos_c() {
    this.monto_pagos.length = 0;
    this.saldo_restante == 0;
    this.saldo_restante = this.monto_total - (this.pagos + this.data2.value.valor_pago)
    if (this.data2.value.valor_pago != '' && this.data2.value.cod_tipo_pago > 0 && this.codigo_venta > 0) {
      if (this.data2.value.cod_tipo_pago == 1) {
        this.monto_pagos.push({
          cedula: this.cedula,
          codigo_venta: this.codigo_venta,
          monto_total: this.monto_total,
          otros_pagos_realizados: this.pagos,
          ultimo_pago_realizado: this.data2.value.valor_pago,
          tipo_pago: 'Parcial',
          saldo_restante: this.saldo_restante,
          estado_id_venta: 'Abierto'
        });

        if (this.data2.value.valor_pago > this.monto_total) {
          this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'El pago a registrar es mayor al valor consumo del cliente', life: 3000 });
        } else {
          this.pagos_c.funct_registra_pagos_s(this.monto_pagos).subscribe({
            next: (data: any) => {
              this.data2.get('valor_pago')?.setValue('');
              this.data2.get('cod_tipo_pago')?.setValue('');
              this.monto_pagos.length = 0;
              this.message.add({ severity: 'info', summary: 'Informativo:', detail: 'Pago registrado exitosamente', life: 3000 });
              const nextElement = (document.querySelector(`[formControlName="valor_pago"]`) as HTMLElement);
              nextElement.focus();
              this.funct_consulta_ventas_x_cliente();
              this.cdr.detectChanges();
            }
          })
        }
      } else {
        this.saldo_restante == 0;
        this.saldo_restante = this.monto_total - (this.pagos + this.data2.value.valor_pago)
        this.monto_pagos.push({
          cedula: this.cedula,
          codigo_venta: this.codigo_venta,
          monto_total: this.monto_total,
          otros_pagos_realizados: this.pagos,
          ultimo_pago_realizado: this.data2.value.valor_pago,
          tipo_pago: 'Total',
          saldo_restante: this.saldo_restante,
          estado_id_venta: 'Cerrado'
        });

        if (this.data2.value.valor_pago == this.monto_restante) {
          this.pagos_c.funct_registra_pagos_s(this.monto_pagos).subscribe({
            next: (data: any) => {
              this.pagos_c.funct_actualiza_estado_ventas(this.cedula, this.codigo_venta).subscribe({
                next: (data: any) => {
                  this.cliente.funct_edita_codigo_venta_s(this.cedula).subscribe({
                    next: (data: any) => {
                      this.ventas_c.funct_registra_ventas_historicos(this.productos).subscribe({
                        next: (data: any) => {
                          this.data2.get('valor_pago')?.setValue('');
                          this.data2.get('cod_tipo_pago')?.setValue('');
                          this.monto_pagos.length = 0;
                          this.monto_total = 0;
                          this.monto_restante = 0;
                          this.pagos = 0;
                          this.message.add({ severity: 'info', summary: 'Informativo:', detail: 'Pago registrado exitosamente', life: 3000 });
                          const nextElement = (document.querySelector(`[formControlName="valor_pago"]`) as HTMLElement);
                          nextElement.focus();
                          this.funct_consulta_ventas_x_cliente();
                          this.cdr.detectChanges();
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        } else {
          this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'No se puede realizar pago total, si el cliente queda con saldo a favor o restante', life: 5000 });
        }
      }
    } else {
      this.message.add({ severity: 'error', summary: 'Error:', detail: 'Para realizar un pago, prinero dede consultar los consumos del cliente y elegir un concepto', life: 5000 });
    }
  }

  funct_imprime_factura_detalle() {
    this.imprimeDetalle.funct_imprime_factura_detalle(this.data.value, this.pagos, this.monto_restante)
  }
}
