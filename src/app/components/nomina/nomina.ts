import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { format } from 'date-fns';
import { NominaService } from './services/nomina.service';
import { MessageService } from 'primeng/api';
import { EmpleadosService } from '../empleados/services/empleados.service';

@Component({
  selector: 'app-nomina',
  standalone: true,
  templateUrl: './nomina.html',
  styleUrl: './nomina.scss',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    InputNumberModule,
    TableModule,
    DatePickerModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Nomina {
  @ViewChild('gastos') inputNumberRef?: any;
  data!: FormGroup;
  data2!: FormGroup;
  tipo_concepto: any[] = [];
  pago_nomina: any[] = [];
  data_empleados: any[] = [];
  num_mes: any;
  num_year: any;
  nombre: any;
  date: Date = new Date();
  fecha_actual?: string;
  hora_actual?: string;
  total_nomina: number = 0;
  seleccionado: any = null;
  seleccionado2: any = null;
  seleccionado3: any = null;
  seleccionado4: any = null;
  seleccionado5: any = null;
  date1: Date | undefined;
  date2: Date | undefined;

  constructor(
    private fb: FormBuilder,
    private nomina: NominaService,
    private empleado: EmpleadosService,
    private message: MessageService,

  ) { }

  ngOnInit(): void {
    this.data = this.fb.group({
      ced_empleado: ['', Validators.required],
      valor_pago: [0, Validators.required],
      tipo_concepto: ['', Validators.required],
      fecha_desde: ['', Validators.required],
      fecha_hasta: ['', Validators.required]
    });

    this.data2 = this.fb.group({
      cedula: ['', Validators.required],
      fecha_d: ['', Validators.required],
      fecha_h: ['', Validators.required]
    });

    this.tipo_concepto = [
      { name: 'Pago nómina', code: '1 - PAGO NOMINA' },
      { name: 'Pago horas extras', code: '2 - PAGO HORAS EXTRAS' },
      { name: 'Pago dia dominical', code: '3 - PAGO DIA DOMINICAL' },
      { name: 'Pago dia festivo', code: '4 - PAGO DIA FESTIVO' }
    ];

    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm:ss');
    this.num_mes = format(this.date, 'M');
    this.num_year = format(this.date, 'yyyy');
    this.hora_actual = format(this.date, 'HH:mm');
    this.funct_retorna_empleados_c();

  }

  funct_retorna_empleados_c() {
    this.empleado.funct_retorna_empleados_s().subscribe({
      next: (data: any) => {
        const objData = JSON.stringify(data);
        const obj = JSON.parse(objData);
        this.data_empleados = [];
        for (let index = 0; index < obj.length; index++) {
          this.data_empleados.push(obj[index]);
        }
      }
    })
  }

  funct_registra_nomina_c() {
    if (this.data.invalid) {
      this.data.markAllAsTouched();
      for (const key in this.data.controls) {
        this.data.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'error', summary: 'Error:', detail: 'Todos los campos son obligatorios' });
      return;
    }

    const data = {
      cedula: this.data.get('ced_empleado')?.value,
      valor_pago: this.data.get('valor_pago')?.value,
      concepto: this.data.get('tipo_concepto')?.value,
      fecha_desde: this.data.get('fecha_desde')?.value,
      fecha_hasta: this.data.get('fecha_hasta')?.value,
      num_mes: this.num_mes,
      num_year: this.num_year
    }

    this.nomina.funct_registra_nomina_s(data).subscribe({
      next: (data: any) => {
        this.data.get('ced_empleado')?.setValue('');
        this.data.get('valor_pago')?.setValue('');
        this.data.get('tipo_concepto')?.setValue('');
        this.data.get('fecha_desde')?.setValue('');
        this.data.get('fecha_hasta')?.setValue('');
        this.seleccionado = null;
        this.seleccionado2 = null;
        this.message.add({ severity: 'success', summary: 'Informativo', detail: 'Registro guardado exitosamente', life: 3000 });

      }
    })
  }

  onDateSelect(event: any, fieldName: string) {
    const date = event;
    const formattedDate = format(date, 'dd-MM-yyyy');
    this.data.get(fieldName)?.setValue(formattedDate);
  }

}
