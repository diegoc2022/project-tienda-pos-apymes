import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { NominaService } from '../nomina/services/nomina.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConsultarGastosService } from '../consultar-gastos/services/consultar-gastos.service';
import { forkJoin } from 'rxjs';

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
    private cdr: ChangeDetectorRef
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
    if (!this.num_mes || !this.num_year) {
      this.message.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El campo Mes y Año son obligatorios para la consulta',
        life: 5000
      });
      return;
    }

    this.visible = true;

    forkJoin({
      ventas: this.ventas_h.funct_retorna_ventas_historicos_s(this.num_mes, this.num_year),
      compras: this.compras_h.funct_retorna_compras_historicos_s(this.num_mes, this.num_year),
      nomina: this.nomina.funt_retorna_nomina_empleado_s(this.num_mes, this.num_year),
      gastos: this.gastos_op.funt_retorna_gastos_operativos_s(this.num_mes, this.num_year)
    }).subscribe({
      next: ({ ventas, compras, nomina, gastos }: any) => {

        this.total_ventas = ventas.reduce(
          (acc: number, item: any) => acc + Math.round(item.subtotal || 0),
          0
        );

        this.total_compras = compras.reduce(
          (acc: number, item: any) => acc + Math.round(item.total_compras || 0),
          0
        );

        this.total_nomina = nomina.reduce(
          (acc: number, item: any) => acc + Math.round(item.valor_pago || 0),
          0
        );

        this.total_gastos = gastos.reduce(
          (acc: number, item: any) => acc + Math.round(item.valor_gastos || 0),
          0
        );

        this.total_gastos_oper =
          this.total_gastos + this.total_nomina;

        const costo_total =
          this.total_compras + this.total_gastos_oper;

        this.utilidad =
          this.total_ventas - costo_total;

        this.data_movimientos = [{
          ventas: this.total_ventas,
          compras: this.total_compras,
          gastos: this.total_gastos,
          nomina: this.total_nomina,
          utilidad: this.utilidad,
          num_mes: Number(this.num_mes),
          num_year: Number(this.num_year)
        }];

        if (this.utilidad === 0) {
          this.message.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: `No hay movimientos para el Mes: ${this.num_mes} Año: ${this.num_year}`,
            life: 5000
          });
        }
        this.visible = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.visible = false;
      }
    });
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
