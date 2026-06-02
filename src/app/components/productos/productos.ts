import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Select, SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { ProductosService } from './services/productos.service';
import { ProveedorService } from '../proveedores/services/proveedor.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  standalone: true,
  styleUrls: ['./productos.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    SelectModule
  ],
  providers: [MessageService, ProductosService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Productos {
  @ViewChild('mySelect') select!: Select;
  formProductos: FormGroup = new FormGroup({});
  data_proveedor: any[] = [];
  fecha_actual?: string;
  date: Date = new Date();
  seleccionado: any = null;
  dataVinculos: any[] = [];


  constructor(
    private fb: FormBuilder,
    private productos: ProductosService,
    private proveedor: ProveedorService,
    private message: MessageService,
    private vinculos: VinculosService,
  ) {
    this.proveedor.funct_retorna_proveedores().subscribe({
      next: (data: any) => {
        const objP = JSON.stringify(data);
        const objP2 = JSON.parse(objP);
        this.data_proveedor = objP2;
      }
    });

  }

  ngOnInit(): void {
    this.formProductos = this.fb.group({
      codProd: ['', Validators.required],
      nombre: ['', Validators.required],
      codProv: ['', Validators.required]
    });
    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm:ss');

  }

  on_enter_codigo_producto(event: any) {
    if (event.code == "Enter") {
      const nextElement = (document.querySelector(`[formControlName="nombre"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  on_enter_nombres_producto(event: any) {
    if (event.code == "Enter") {
      this.select.focus();
      this.select.show();
    }
  }

  funct_registra_nuevo_producto() {
    if (this.formProductos.invalid) {
      this.formProductos.markAllAsTouched();
      for (const key in this.formProductos.controls) {
        this.formProductos.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'warn', summary: 'Error:', detail: 'Para crear un producto debe completar todos los campos', life: 5000 });
      return;
    }

    this.dataVinculos = [];
    this.dataVinculos.push({
      codigoInicial: this.formProductos.value.codProd,
      codigoVinculo: this.formProductos.value.codProd
    })

    this.productos.funct_crea_productos(this.formProductos.value).subscribe({
      next: (resp: any) => {
        if (resp.code == 409) {
          this.message.add({ severity: 'error', summary: 'Advertencia:', detail: resp.msg });
          return;
        } else {
          this.vinculos.funct_registra_vinculos_s(this.dataVinculos).subscribe({
            next: (data: any) => {
              this.message.add({ severity: 'info', summary: 'Advertencia:', detail: 'Producto guardado correctamente', life: 3000 });
              this.formProductos.reset();
              const nextElement = (document.querySelector(`[formControlName="codProd"]`) as HTMLElement);
              nextElement.focus();
            }, error: (error: any) => {
              this.message.add({ severity: 'error', summary: 'Create producto:', detail: error, life: 3000 });
            }
          });
        }
      }
    })

  }
}
