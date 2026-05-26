import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { GastosService } from './services/gastos.service';

@Component({
  selector: 'app-gastos',
  standalone: true,
  templateUrl: './gastos.html',
  styleUrl: './gastos.scss',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    CommonModule,
    InputNumberModule,
    TableModule
  ],
  providers: [MessageService, GastosService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Gastos {
  @ViewChild('gastos') inputNumberRef?: any;
  data!: FormGroup;
  tipo_gastos: any[] = [];
  num_mes: any;
  num_year: any;
  option_m: any[] = [];
  option_y: any[] = [];
  date: Date = new Date();
  fecha_actual?: string;
  hora_actual?: string;
  data_op: any[] = [];
  seleccionado: any = null;
  seleccionado2: any = null;
  seleccionado3: any = null;

  constructor(
    private fb: FormBuilder,
    private gastos_op: GastosService,
    private message: MessageService,
  ) { }

  ngOnInit(): void {
    this.data = this.fb.group({
      valor_gastos: [0, Validators.required],
      tipo_concepto: ['', Validators.required],
      observ: ['', Validators.required],
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


  funct_registra_gastos_operativos_c() {
    this.data_op.length = 0;
    this.data_op.push({
      valor_gastos: this.data.value.valor_gastos,
      tipo_concepto: this.data.value.tipo_concepto,
      observacion: this.data.value.observ,
      num_mes: this.data.value.num_mes,
      num_year: this.data.value.num_year,
      fecha_registro: this.fecha_actual,
      hora_registro: this.hora_actual
    });

    if (this.data.invalid) {
      this.data.markAllAsTouched();
      for (const key in this.data.controls) {
        this.data.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'error', summary: 'Error:', detail: 'Los campos: Ingrese valor, Tipo concepto y Detalle, son obligatorios' });
      return;
    }

    this.gastos_op.funct_registra_gastos_operativos_s(this.data_op).subscribe({
      next: (data: any) => {
        this.data.get('valor_gastos')?.setValue('');
        this.data.get('tipo_concepto')?.setValue('');
        this.data.get('observ')?.setValue('');
        this.data.get('num_mes')?.setValue('');
        this.data.get('num_year')?.setValue('');
        this.seleccionado = null;
        this.seleccionado2 = null;
        this.seleccionado3 = null;
        this.message.add({ severity: 'success', summary: 'Informativo', detail: 'Registro guardado exitosamente', life: 3000 });
        const nativeInput = this.inputNumberRef?.input?.nativeElement;
        nativeInput?.focus();
      }
    })
  }

}
