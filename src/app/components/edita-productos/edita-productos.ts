import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table } from 'dexie';
import { MessageService } from 'primeng/api';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { ProductosService } from '../productos/services/productos.service';
import * as Swal from 'sweetalert2';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edita-productos',
  standalone: true,
  templateUrl: './edita-productos.html',
  styleUrl: './edita-productos.scss',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    InputIconModule,
    IconFieldModule,
    ToastModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditaProductos {
  @ViewChild('dt1') dt1!: Table;
  dataBuscaProductos: any[] = [];
  selectedProduct1?: any[];
  value: string = '';
  formData: FormGroup = new FormGroup({});
  formCheck: FormGroup = new FormGroup({});
  globalFilter = '';
  dataVinculos: any[] = [];


  constructor(
    private productos: ProductosService,
    private messageService: MessageService,
    private vinculos: VinculosService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.formData = this.fb.group({
      codInicial: ['', Validators.required],
      codNuevo: ['', Validators.required],
      nombreProd: ['', Validators.required]
    });
    setTimeout(() => {
      this.funct_retorna_productos();

    }, 1000)

  }

  funct_retorna_productos() {
    this.dataBuscaProductos.length = 0;
    this.productos.funct_retorna_full_productos().subscribe({
      next: (data: any) => {
        for (let index = 0; index < data.length; index++) {
          this.dataBuscaProductos.push(data[index]);
        }
        this.cdr.detectChanges();
      }
    })
  }

  onRowSelect(event: any) {
    Swal.default.fire({
      title: '¿Está seguro?',
      text: 'Que desea eliminar el vínculo para editar el código',
      icon: 'warning',
      width: '330px',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          this.value = event.data.codProd;
          this.formData.get('codInicial')?.setValue(event.data.codProd);
          this.formData.get('codNuevo')?.setValue(event.data.codProd);
          this.formData.get('nombreProd')?.setValue(event.data.descripcion);
          localStorage.removeItem('codigoInicial');
          this.vinculos.funct_retorna_codigo_vinculo(event.data.codProd).subscribe({
            next: (data: any) => {
              this.dataVinculos = [];
              if (data.length > 1) {
                const codigos = data.map((item: any) => item.codigoInicial);
                localStorage.setItem('codigoInicial', JSON.stringify(codigos));
                this.vinculos.funct_elimina_vinculos_s(data).subscribe({
                  next: (data: any) => {
                    const nextElement = (document.querySelector(`[formControlName="codNuevo"]`) as HTMLElement);
                    nextElement.focus();
                  }
                })
              } else {
                this.vinculos.funct_elimina_vinculos_s(data).subscribe({
                  next: (data: any) => {
                    const nextElement = (document.querySelector(`[formControlName="codNuevo"]`) as HTMLElement);
                    nextElement.focus();
                  }
                })
              }
            }
          })
          this.cdr.detectChanges();
        }, 1000)
      }
    });
  }

  funct_edita_producto_c() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      for (const key in this.formData.controls) {
        this.formData.controls[key].markAsDirty();
      }
      this.messageService.add({ severity: 'error', summary: 'Error:', detail: 'Los campos nuevo y nombre, son obligatorios' });
      return;
    }

    if (this.dataVinculos.length < 1) {
      this.messageService.add({ severity: 'warn', summary: 'Advetencia:', detail: 'Para continuar primero debe presionar enter en el segundo campo codigo producto', life: 5000 });
      const nextElement = (document.querySelector(`[formControlName="codNuevo"]`) as HTMLElement);
      nextElement.focus();
      return
    }

    this.productos.funct_edita_productos_s(this.formData.value).subscribe({
      next: (data: any) => {
        this.vinculos.funct_registra_vinculos_s(this.dataVinculos).subscribe({
          next: (data2: any) => {
            this.messageService.add({ severity: 'info', summary: 'Info:', detail: 'Datos actualizados correctamente' });
            this.globalFilter = '';
            this.dt1.clear();
            this.funct_retorna_productos();
            this.formData.get('codNuevo')?.setValue('');
            this.formData.get('nombreProd')?.setValue('');
          }
        });
        this.cdr.detectChanges();

      }
    })
  }

  onEnterCodigoProducto(event: any): void {
    if (event.code == "Enter") {
      const vinc = localStorage.getItem('codigoInicial');
      const dat = JSON.parse(vinc || '[]')
      if (dat.length > 1) {
        this.dataVinculos = [];
        for (let index = 0; index < dat.length; index++) {
          if (dat[index] != this.formData.value.codInicial) {
            this.dataVinculos.push({
              codigoInicial: dat[index],
              codigoVinculo: this.formData.value.codNuevo
            })
          } else {
            this.dataVinculos.push({
              codigoInicial: this.formData.value.codNuevo,
              codigoVinculo: this.formData.value.codNuevo
            })
          }
        }

      } else {
        this.dataVinculos = [];
        this.dataVinculos.push({
          codigoInicial: this.formData.value.codNuevo,
          codigoVinculo: this.formData.value.codNuevo
        })
      }
      const nextElement = (document.querySelector(`[formControlName="nombreProd"]`) as HTMLElement);
      nextElement.focus();
    }
  }


}
