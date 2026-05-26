import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConsultarGastosService } from './services/consultar-gastos.service';
import { format } from 'date-fns';
import { formatearFecha } from '../formato-fecha/formato-fecha';

@Component({
  selector: 'app-consultar-gastos',
  standalone: true,
  templateUrl: './consultar-gastos.html',
  styleUrl: './consultar-gastos.scss',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    CommonModule,
    TableModule
  ],
  providers: [MessageService, ConsultarGastosService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultarGastos {
  @ViewChild('gastos') inputNumberRef?: any;
  data2!: FormGroup;
  tipo_gastos: any[] = [];
  gastos_data: any[] = [];
  total_gastos: number = 0;
  num_mes: any;
  num_year: any;
  option_m: any[] = [];
  option_y: any[] = [];
  date: Date = new Date();
  fecha_actual?: string;
  hora_actual?: string;
  seleccionado4: any = null;
  seleccionado5: any = null;

  constructor(
    private fb: FormBuilder,
    private consultaGastos: ConsultarGastosService,
    private message: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.data2 = this.fb.group({
      num_mes: ['', Validators.required],
      num_year: ['', Validators.required],
    });

    this.tipo_gastos = [
      { name: 'Gastos opertivos', code: '1-GASTOS OPERATIVOS' }
    ];

    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm:ss');
    this.num_mes = format(this.date, 'M');
    this.num_year = format(this.date, 'yyyy');
    this.hora_actual = format(this.date, 'HH:mm');

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



  funct_retorna_gastos_operativos_c() {
    if (this.data2.invalid) {
      this.data2.markAllAsTouched();
      for (const key in this.data2.controls) {
        this.data2.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'error', summary: 'Error:', detail: 'Los campos: Ingrese valor, Tipo concepto y Detalle, son obligatorios' });
      return;
    }

    this.consultaGastos.funt_retorna_gastos_operativos_s(this.data2.value.num_mes, this.data2.value.num_year).subscribe({
      next: (data: any) => {
        this.total_gastos = 0;
        this.gastos_data.length = 0;
        if (data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            this.total_gastos += Math.round(data[index].valor_gastos)
            this.gastos_data.push({
              id: data[index].id,
              tipo_concepto: data[index].tipo_concepto,
              observacion: data[index].observacion,
              num_mes: data[index].num_mes,
              num_year: data[index].num_year,
              valor_gasto: data[index].valor_gasto,
              fecha_registro: formatearFecha(data[index].fecha_registro)
            });
          }
          this.cdr.detectChanges();
        } else {
          this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'No hay gastos registrados para el Mes: ' + this.data2.value.num_mes + ' Año: ' + this.data2.value.num_year, life: 5000 });
        }

      }
    })
  }

  funct_onchange() {
    this.gastos_data = [];
    this.total_gastos = 0;
  }
}
