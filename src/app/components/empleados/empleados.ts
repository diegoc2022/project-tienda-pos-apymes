import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Select, SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { EmpleadosService } from './services/empleados.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-empleados',
  standalone: true,
  templateUrl: './empleados.html',
  styleUrls: ['./empleados.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    SelectModule
  ],
  providers: [MessageService, EmpleadosService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Empleados {
  @ViewChild('dropdown') dropdown!: Select;
  data: FormGroup = new FormGroup({});
  data_proveedor: any[] = [];
  fecha_actual?: string;
  date: Date = new Date();
  options: any[] = [];
  seleccionado: any = null;

  constructor(
    private fb: FormBuilder,
    private empleados: EmpleadosService,
    private message: MessageService,
  ) {


  }
  ngOnInit(): void {
    this.data = this.fb.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      dirEmp: ['', Validators.required],
      telEmp: ['', Validators.required],
      ciudad: ['', Validators.required]
    });

    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm:ss');

    this.options = [
      { nombre: 'Bogota', value: 'Bogota' },
      { nombre: 'Medellin', value: 'Medellin' },
      { nombre: 'Cali', value: 'Cali' },
      { nombre: 'Pereira', value: 'Pereira' },
      { nombre: 'Ibague', value: 'Ibague' },
      { nombre: 'Bucaramanga', value: 'Bucaramanga' },
      { nombre: 'Barranquilla', value: 'Barranquilla' },
      { nombre: 'Sincelejo', value: 'Sincelejo' },
      { nombre: 'Cartagena', value: 'Cartagena' },
      { nombre: 'Pasto', value: 'Pasto' },
      { nombre: 'Cucuta', value: 'Cucuta' },
      { nombre: 'Manizales', value: 'Manizales' },

    ];

  }

  on_enter_codigo_empleado(event: any) {
    if (event.code == "Enter") {
      const nextElement = (document.querySelector(`[formControlName="nombre"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  on_enter_nombre_empleado(event: any) {
    if (event.code == "Enter") {
      const nextElement = (document.querySelector(`[formControlName="usuario"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  on_enter_usuario(event: any) {
    if (event.code == "Enter") {
      const nextElement = (document.querySelector(`[formControlName="dirEmp"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  on_enter_dir_empleado(event: any) {
    if (event.code == "Enter") {
      const nextElement = (document.querySelector(`[formControlName="telEmp"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  on_enter_tel_empleado(event: any) {
    if (event.code == "Enter") {
      this.dropdown.focus();
      this.dropdown.show();
    }
  }

  funct_registra_empleados() {
    if (this.data.invalid) {
      this.data.markAllAsTouched();
      for (const key in this.data.controls) {
        this.data.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'error', summary: 'Error:', detail: 'Todos los campos de este formulario, son obligatorios' });
      return;
    }

    this.empleados.funct_registra_emeplados_s(this.data.value).subscribe({
      next: (data: any) => {
        const obj = JSON.stringify(data);
        const obj2 = JSON.parse(obj);
        if (obj2.code != 409) {
          this.data.get('cedula')?.setValue('');
          this.data.get('nombre')?.setValue('');
          this.data.get('usuario')?.setValue('');
          this.data.get('dirEmp')?.setValue('');
          this.data.get('telEmp')?.setValue('');
          this.data.get('ciudad')?.setValue('');
          const nextElement = (document.querySelector(`[formControlName="cedula"]`) as HTMLElement);
          nextElement.focus();
          this.message.add({ severity: 'info', summary: 'Informativo:', detail: 'Registro guardado exitosamente' });
        } else {
          this.data.get('nit')?.setValue('');
          this.data.get('nombreProv')?.setValue('');
          this.data.get('dirProv')?.setValue('');
          this.data.get('telProv')?.setValue('');
          this.data.get('ciudad')?.setValue('');
          const nextElement = (document.querySelector(`[formControlName="cedula"]`) as HTMLElement);
          nextElement.focus();
          this.message.add({ severity: 'error', summary: 'Error:', detail: obj2.msg, life: 3000 });
        }

      }
    })
  }
}
