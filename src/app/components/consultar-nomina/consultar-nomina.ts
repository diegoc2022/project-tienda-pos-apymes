import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { format } from 'date-fns';
import { ConsultarNominaService } from './services/consultar-nomina.service';
import { EmpleadosService } from '../empleados/services/empleados.service';
import { formatearFecha } from '../formato-fecha/formato-fecha';

@Component({
  selector: 'app-consultar-nomina',
  standalone: true,
  templateUrl: './consultar-nomina.html',
  styleUrl: './consultar-nomina.scss',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    InputNumberModule,
    TableModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultarNomina {
  @ViewChild('gastos') inputNumberRef?: any;
  data2!: FormGroup;
  tipo_concepto: any[] = [];
  pago_nomina: any[] = [];
  data_empleados: any[] = [];
  num_mes: any;
  num_year: any;
  nombre: any = '';
  date: Date = new Date();
  fecha_actual?: string;
  hora_actual?: string;
  seleccionado: any = null;
  seleccionado2: any = null;
  seleccionado3: any = null;
  seleccionado4: any = null;
  seleccionado5: any = null;
  option_m: any[] = [];
  option_y: any[] = [];

  constructor(
    private fb: FormBuilder,
    private nomina: ConsultarNominaService,
    private empleado: EmpleadosService,
    private message: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.data2 = this.fb.group({
      cedula: ['', Validators.required],
      num_mes: ['', Validators.required],
      num_year: ['', Validators.required]
    });

    this.tipo_concepto = [
      { name: 'Pago nómina', code: '1 - PAGO NOMINA' },
      { name: 'Pago horas extras', code: '2 - PAGO HORAS EXTRAS' },
      { name: 'Pago dia dominical', code: '3 - PAGO DIA DOMINICAL' },
      { name: 'Pago dia festivo', code: '4 - PAGO DIA FESTIVO' }
    ];

    this.fecha_actual = format(this.date, 'd-M-yyyy');
    this.num_mes = format(this.date, 'M');
    this.num_year = format(this.date, 'yyyy');
    this.hora_actual = format(this.date, 'HH:mm');
    this.funct_retorna_empleados_c();

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

  funct_retorna_empleados_c() {
    this.empleado.funct_retorna_empleados_s().subscribe({
      next: (data: any) => {
        this.data_empleados = [];
        for (let index = 0; index < data.length; index++) {
          this.data_empleados.push(data[index]);
        }
      }
    })
  }


  funct_retorna_pago_nomina_c() {
    if (this.data2.invalid) {
      this.data2.markAllAsTouched();
      for (const key in this.data2.controls) {
        this.data2.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'error', summary: 'Error:', detail: 'Para consultar nómina debe llenar todos los campos' });
      return;
    }

    this.nomina.funt_retorna_pagos_nomina_s(this.data2.value.cedula, this.data2.value.num_mes, this.data2.value.num_year).subscribe({
      next: (data: any) => {
        this.pago_nomina = [];
        if (data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            this.pago_nomina.push({
              cedula: data[index].cedula,
              fecha_desde: data[index].fecha_desde,
              fecha_hasta: data[index].fecha_hasta,
              concepto: data[index].concepto,
              valor_pago: data[index].valor_pago
            });
          }
          this.cdr.detectChanges();
        } else {
          this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'No hay pagos registrados para este empleado en las fecha seleccionadas', life: 5000 });
        }
      }
    })
  }



  funct_onchange(data: any) {
    this.empleado.funct_retorna_one_empleados_s(data.value).subscribe({
      next: (data: any) => {
        this.pago_nomina = [];
        this.nombre = '';
        this.nombre = data[0].nombre_empleado
      }
    })
  }

  funct_onchange_m() {
    //this.gastos_data = [];
    //this.total_gastos = 0;
  }
}
