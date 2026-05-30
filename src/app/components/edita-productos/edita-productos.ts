import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  dataBuscaProductos: any[] = [];
  selectedProduct1?: any[];
  value: string = '';
  formData: FormGroup = new FormGroup({});
  formCheck: FormGroup = new FormGroup({});
  globalFilter = ''


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
    this.funct_retorna_productos();
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
          this.vinculos.funct_retorna_vinculos(event.data.codProd).subscribe({
            next: (data: any) => {
              if (data) {
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

  clear(table: Table) {
    table.clear();
  }

  functEditaCodigo() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      for (const key in this.formData.controls) {
        this.formData.controls[key].markAsDirty();
      }
      this.messageService.add({ severity: 'error', summary: 'Error:', detail: 'El campo lea código, es obligatorio' });
      return;
    }


    this.productos.funct_edita_codigo_producto_s(this.formData.value).subscribe({
      next: (data: any) => {
        const objData = JSON.stringify(data);
        const obj = JSON.parse(objData);
        if (obj.status != 409) {
          const data = {
            codigoInic: this.formData.value.codNuevo,
            codigoVinc: this.formData.value.codNuevo
          }
          this.vinculos.funct_registra_vinculos_s(data).subscribe({
            next: (data: any) => {
              this.messageService.add({ severity: 'info', summary: 'Informativo', detail: 'Código actualizado correctamente' });
              this.formData.get('codInicial')?.setValue('');
              this.formData.get('codNuevo')?.setValue('');
            }, error: (error: any) => {
              console.log("Error: ", error);
            }
          });

        } else {
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: obj.msg });
        }
      }
    })

    this.productos.funct_edita_nombre_producto_s(this.formData.value).subscribe({
      next: (data: any) => {
        this.messageService.add({ severity: 'info', summary: 'Informativo', detail: 'Código actualizado correctamente' });
        this.formData.get('codInicial')?.setValue('');
        this.formData.get('codNuevo')?.setValue('');
        this.funct_retorna_productos();
      }
    })


  }

  onEnterCodigoProducto(event: any): void {
    if (event.code == "Enter") {
      const nextElement = (document.querySelector(`[formControlName="cantidad"]`) as HTMLElement);
      nextElement.focus();
    }
  }


}
