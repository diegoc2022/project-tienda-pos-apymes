import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MovimientosxmesService } from './services/movimientosxmes.service';
import { VentasSerivice } from '../form-ventas/services/ventas.serivice';
import { ComprasService } from '../compras/services/compras.service';
import { GastosService } from '../gastos/services/gastos.service';
import { NominaService } from '../nomina/services/nomina.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConsultarGastosService } from '../consultar-gastos/services/consultar-gastos.service';

@Component({
  selector: 'app-movimientos-x-mes',
  standalone: true,
  templateUrl: './movimientos-x-mes.html',
  styleUrl: './movimientos-x-mes.scss',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    CommonModule,
    InputNumberModule,
    SelectModule,
    TableModule,
    ProgressBarModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MovimientosXMes {
  data_movimientos: any[] = [];
  total_ventas: number = 0;
  total_compras: number = 0;
  total_gastos: number = 0;
  total_nomina: number = 0;
  total_gastos_oper: number = 0;
  utilidad: number = 0;
  num_mes: any;
  num_year: any;
  option_m: any[] = [];
  option_y: any[] = [];
  date: Date = new Date();
  fecha_actual?: string;
  hora_actual?: string;
  movimientos: any[] = [];
  seleccionado: any = null;
  seleccionado2: any = null;
  visible: boolean = false;


  constructor(
    private ventas_h: VentasSerivice,
    private compras_h: ComprasService,
    private gastos_op: ConsultarGastosService,
    private movimientos_s: MovimientosxmesService,
    private message: MessageService,
    private nomina: NominaService,
  ) { }

  ngOnInit(): void {
    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm:ss');
    this.hora_actual = format(this.date, 'HH:mm');
    this.visible = false;

    this.option_m = [
      { nombre: 'Enero', value: 1 },
      { nombre: 'Febrero', value: 2 },
      { nombre: 'Marzo', value: 3 },
      { nombre: 'Abril', value: 4 },
      { nombre: 'Mayo', value: 5 },
      { nombre: 'Junio', value: 6 },
      { nombre: 'Julio', value: 7 },
      { nombre: 'Agosto', value: 8 },
      { nombre: 'Septiembre', value: 9 },
      { nombre: 'Octubre', value: 10 },
      { nombre: 'Noviembre', value: 11 },
      { nombre: 'Diciembre', value: 12 }
    ];

    this.option_y = [
      { nombre: '2025', value: 2025 },
      { nombre: '2026', value: 2026 },
      { nombre: '2027', value: 2027 },
      { nombre: '2028', value: 2028 },
      { nombre: '2029', value: 2029 },
      { nombre: '2030', value: 2030 },
      { nombre: '2031', value: 2031 },
      { nombre: '2032', value: 2032 },
      { nombre: '2033', value: 2033 },
      { nombre: '2034', value: 2034 },
      { nombre: '2035', value: 2035 },
      { nombre: '2036', value: 2036 },
      { nombre: '2037', value: 2037 },
      { nombre: '2038', value: 2038 },
      { nombre: '2039', value: 2039 },
      { nombre: '2040', value: 2040 }

    ];
  }

  funct_retorna_movimientos_c() {
    if (this.num_mes != null && this.num_year != null) {
      this.visible = true;
      this.ventas_h.funct_retorna_ventas_historicos_s(this.num_mes, this.num_year).subscribe({
        next: (data: any) => {
          const obj = JSON.stringify(data);
          const objs = JSON.parse(obj);
          this.total_ventas = 0;
          for (let index = 0; index < objs.length; index++) {
            this.total_ventas += Math.round(objs[index].subtotal)
          }

          this.compras_h.funct_retorna_compras_historicos_s(this.num_mes, this.num_year).subscribe({
            next: (data: any) => {
              const obj = JSON.stringify(data);
              const objs = JSON.parse(obj);
              this.total_compras = 0;
              for (let index = 0; index < objs.length; index++) {
                this.total_compras += Math.round(objs[index].total_compras)
              }

              this.nomina.funt_retorna_nomina_empleado_s(this.num_mes, this.num_year).subscribe({
                next: (data: any) => {
                  const obj = JSON.stringify(data);
                  const objs = JSON.parse(obj);
                  this.total_nomina = 0;
                  for (let index = 0; index < objs.length; index++) {
                    this.total_nomina += Math.round(objs[index].valor_pago)
                  }

                  this.gastos_op.funt_retorna_gastos_operativos_s(this.num_mes, this.num_year).subscribe({
                    next: (data: any) => {
                      const obj = JSON.stringify(data);
                      const objs = JSON.parse(obj);
                      this.total_gastos = 0;
                      this.utilidad = 0;
                      this.visible = false;
                      this.data_movimientos.length = 0;
                      for (let index = 0; index < objs.length; index++) {
                        this.total_gastos += Math.round(objs[index].valor_gastos)
                      }
                      this.total_gastos_oper = Math.round(this.total_gastos) + Math.round(this.total_nomina);
                      const costo_total = Math.round(this.total_compras) + Math.round(this.total_gastos_oper);
                      this.utilidad = Math.round(this.total_ventas) - Math.round(costo_total);
                      this.data_movimientos.push({
                        ventas: this.total_ventas,
                        compras: this.total_compras,
                        gastos: this.total_gastos,
                        nomina: this.total_nomina,
                        utilidad: this.utilidad,
                        num_mes: parseInt(this.num_mes),
                        num_year: parseInt(this.num_year)
                      })
                      if (this.utilidad == 0) {
                        this.message.add({ severity: 'warn', summary: 'Adventencia', detail: 'No hay movimientos para el Mes: ' + this.num_mes + ' Año: ' + this.num_year, life: 5000 });
                      }
                    }
                  })
                }
              })
            }
          })
        }
      })
    } else {
      this.message.add({ severity: 'warn', summary: 'Adventencia', detail: 'El campo Mes y Año son obligatorios para la consulta', life: 5000 });
    }
  }

  on_input_select_mes(event: any) {
    this.num_mes = event.value;
    this.data_movimientos = [];
  }

  on_input_select_year(event: any) {
    this.num_year = event.value;
  }

  funct_imprime_movimeintos_c() {
    this.movimientos.length = 0;
    this.movimientos.push({
      ventas: this.total_ventas,
      compras: this.total_compras,
      gastos: this.total_gastos,
      nomina: this.total_nomina,
      utilidad: this.utilidad,
      mes: this.num_mes,
      year: this.num_year
    })

    if (this.num_mes != undefined && this.num_year != undefined) {
      this.movimientos_s.funct_imprime_movimientos_s(this.data_movimientos);
    } else {
      this.message.add({ severity: 'warn', summary: 'Adventencia', detail: 'Para imprimir los movimientos, primero debe realizar la consulta', life: 3000 });
    }
  }
}
