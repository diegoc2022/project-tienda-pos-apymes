import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { VentasSerivice } from '../form-ventas/services/ventas.serivice';
import * as Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-migrar-ventas',
  standalone: true,
  templateUrl: './migrar-ventas.html',
  styleUrl: './migrar-ventas.scss',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    FormsModule,
    CommonModule,
    TableModule,
    ButtonModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MigrarVentas implements OnInit {
  selectedProduct1?: any[];
  products: any[] = [];
  idCaja: number = 0;
  base_caja: number = 0;
  fecha_actual?: string;
  user: any;

  constructor(
    private message: MessageService,
    private ventas: VentasSerivice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.user = localStorage.getItem('user');
    this.funct_retorna_ventas_c();
  }


  funct_retorna_ventas_c() {
    this.ventas.funct_retorna_ventas_temp().subscribe({
      next: (data: any) => {
        this.products = data.filter(
          (item: any) => item.estado === 'cerrado1'
        );
        this.cd.detectChanges();
      }
    });

  }

  funct_migrar_ventas_del_dia_c() {
    Swal.default.fire({
      title: '¿Está seguro?',
      text: 'Que desea migrar las ventas del dia a la tabla de histórico',
      icon: 'warning',
      width: '330px',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, voy a migrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.products.length > 0) {
          this.ventas.funct_registra_ventas_historicos(this.products).subscribe({
            next: (data: any) => {
              this.ventas.funct_elimina_ventas_temporal().subscribe({
                next: (data: any) => {
                  const objData = JSON.stringify(data);
                  const result = JSON.parse(objData);
                  localStorage.removeItem('estado_apertura');
                  localStorage.setItem('base_caja', '0');
                  this.products.length = 0;
                  this.message.add({ severity: 'success', summary: 'Información', detail: 'Migración registrada exitosamente', life: 3000 });
                }
              })
            }
          })

        } else {
          this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'No hay data para migrar' });
        }
      }
    });

  }
}
