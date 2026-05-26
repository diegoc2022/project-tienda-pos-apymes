import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PagosConsumosServices } from '../pagos-consumos/services/pagos-consumos.services';
import { ClientesService } from '../clientes/services/clientes.service';
import { formatearFecha } from '../formato-fecha/formato-fecha';

@Component({
  selector: 'app-consultar-pagos',
  standalone: true,
  templateUrl: './consultar-pagos.html',
  styleUrl: './consultar-pagos.scss',
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
export class ConsultarPagos {
  @ViewChild('codigo') inputNumberRef!: any;
  data: FormGroup = new FormGroup({});
  pagos_detalle: any[] = [];
  clientes: any[] = [];
  seleccionado: any = null;
  selectedProduct: any[] = [];
  nombre: string = '';
  codigo_venta: number = 0;
  consumo_actual: number = 0;
  saldo_restante: number = 0;

  constructor(
    private fb: FormBuilder,
    private cliente: ClientesService,
    private message: MessageService,
    private pagos_s: PagosConsumosServices,
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
    this.cliente.funct_retorna_clientes_s().subscribe({
      next: (data: any) => {
        const objData = JSON.stringify(data);
        const obj = JSON.parse(objData);
        this.clientes = [];
        for (let index = 0; index < obj.length; index++) {
          this.clientes.push({
            nombre: obj[index].codigo_venta + ' - ' + obj[index].nombre,
            codigo_cliente: obj[index].codigo_cliente
          });
        }
      }
    })
  }

  funct_retornar_pagos_detalles() {
    if (this.data.value.cliente != null && this.data.value.codigo_venta != "") {
      this.pagos_s.funct_consulta_ventas_x_cliente(this.data.value).subscribe({
        next: (data: any) => {
          this.consumo_actual = 0;
          for (let index = 0; index < data.length; index++) {
            this.consumo_actual += data[index].subtotal
          }

          this.pagos_s.funct_retorna_pagos_s(this.data.value).subscribe({
            next: (data: any) => {
              this.pagos_detalle.length = 0;
              this.saldo_restante = 0;
              if (data.length > 0) {
                for (let index = 0; index < data.length; index++) {
                  this.saldo_restante += data[index].saldo_restante;
                  this.pagos_detalle.push({
                    cedula: data[index].cedula,
                    codigo_venta: data[index].codigo_venta,
                    monto_total: data[index].monto_total,
                    otros_pagos: data[index].otros_pagos_realizados,
                    ultimo_pago: data[index].ultimo_pago_realizado,
                    total_pagos: data[index].total_pagos_realizados,
                    saldo_restante: this.consumo_actual - data[index].total_pagos_realizados,
                    tipo_pago: data[index].tipo_pago,
                    estado: data[index].estado_id_venta,
                    fecha: formatearFecha(data[index].fecha_registro)
                  });
                }
              } else {
                this.message.clear();
                this.message.add({ severity: 'warn', summary: 'Informativo:', detail: 'El cliente seleccionado no tiene pagos registrados con este id ventas: ' + this.data.value.codigo_venta, life: 5000 });
              }
              this.cdr.detectChanges();
            }
          })
        }
      })

    } else {
      this.message.add({ severity: 'warn', summary: 'Informativo:', detail: 'El campo Cliente y Id ventas son obligarios para la consulta', life: 5000 });
    }
  }

  funct_onchange(data: any) {
    if (data.value != null) {
      this.cliente.funct_retorna_one_cliente(data.value).subscribe({
        next: (data: any) => {
          const objData = JSON.stringify(data);
          const obj = JSON.parse(objData);
          this.pagos_detalle = [];
          for (let index = 0; index < obj.length; index++) {
            this.nombre = obj[index].nombre;
            this.codigo_venta = obj[index].codigo_venta;
          }
          this.data.get('codigo_venta')?.setValue(this.codigo_venta);
          const nextElement = (document.querySelector(`[formControlName="codigo_venta"]`) as HTMLElement);
          nextElement.focus();

        }
      })

    }
  }
}
