import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import * as Swal from 'sweetalert2';
import { ProductosService } from '../productos/services/productos.service';
import { InventarioActualService } from './services/inventario-actual.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-inventario-actual',
  standalone: true,
  templateUrl: './inventario-actual.html',
  styleUrl: './inventario-actual.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    InputNumberModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InventarioActual {

  formId: FormGroup = new FormGroup({});
  date: Date = new Date();
  fecha_actual: any = '';
  inventario_actual: any[] = [];

  constructor(
    private message: MessageService,
    private inv_actual: InventarioActualService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private productos: ProductosService
  ) { }

  ngOnInit() {
    this.formId = this.fb.group({
      id_inv: [null, Validators.required]
    });
    this.funct_retorna_productos();
  }

  funct_retorna_productos() {
    this.productos.funct_retorna_full_productos().subscribe({
      next: (data: any) => {
        this.inventario_actual = [];
        for (let index = 0; index < data.length; index++) {
          this.inventario_actual.push({
            codprod: data[index].codProd,
            descripcion: data[index].descripcion,
            stock_actual: data[index].existencia
          });
        }
        this.formId.setValue({ id_inv: data.length });
      }
    })
  }

  func_registra_inventario_actual() {
    Swal.default.fire({
      title: '¿Está seguro?',
      text: 'Que desea cargar el Stock Actual para realizar inventario',
      icon: 'warning',
      width: '340px',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cargar stock actual',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inv_actual.funct_elima_inventario_actual_s().subscribe({
          next: (data: any) => {
            const fecha_created = format(this.date, 'yyyy-MM-dd');
            localStorage.setItem('fecha_stock_actual', fecha_created);
            setTimeout(() => {
              this.inv_actual.funct_registra_inventario_actual_s(this.inventario_actual).subscribe({
                next: (data: any) => {
                  this.fecha_actual = localStorage.getItem('fecha_stock_actual');
                  this.message.add({ severity: 'success', summary: 'Info:', detail: 'El stock actual se ha cargado corectamente, ya puede iniciar con el inventarios', life: 3000 });
                }
              })
            }, 2000)
          }
        })
      }
    });
  }
}
