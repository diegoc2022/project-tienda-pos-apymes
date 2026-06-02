import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { formatearFecha } from '../formato-fecha/formato-fecha';
import { ProductosService } from '../productos/services/productos.service';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { MessageService } from 'primeng/api';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.scss',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    CommonModule,
    ButtonModule,
    ProgressBarModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListaProductos {
  @ViewChild('dt1') dt1!: Table;
  data: any[] = [];
  codigo_inicial: any;
  codigo_vinculo: any;
  habilitado: boolean = false;
  visible: boolean = false;
  globalFilter = ''


  constructor(
    private productos: ProductosService,
    private vinculos: VinculosService,
    private message: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.visible = false;
    this.funct_retorna_productos();
  }

  funct_retorna_productos() {
    this.visible = true;
    this.productos.funct_retorna_full_productos().subscribe({
      next: (data: any) => {
        this.data = [];
        for (let index = 0; index < data.length; index++) {
          this.data.push(data[index]);
        }
        this.habilitado = true;
        this.visible = false;
        this.cdr.detectChanges();
      }
    })
  }

  funct_elimina_productos(data: any) {
    this.codigo_inicial = data.codProd;
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Que desea eliminar este producto con código: ' + data.codProd + ' de la base de datos',
      icon: 'warning',
      width: '330px',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.vinculos.funct_retorna_codigo_inicial(this.codigo_inicial).subscribe({
          next: (data: any) => {
            if (data.length > 0) {
              this.vinculos.funct_elimina_vinculos_s(data).subscribe({
                next: (data2: any) => {
                  this.productos.funct_elimina_productos_s(this.codigo_inicial).subscribe({
                    next: (data3: any) => {
                      setTimeout(() => {
                        this.data = this.data.filter(producto => producto.codigoInicial !== this.codigo_inicial);
                        this.globalFilter = '';
                        this.dt1.clear();
                        this.funct_retorna_productos();
                        this.message.add({ severity: 'success', summary: 'Info:', detail: 'Se ha eliminado un producto de la base de datos.', life: 3000 });
                      }, 1000)
                      this.cdr.detectChanges();
                    }
                  })
                }
              })
            } else {
              this.productos.funct_elimina_productos_s(this.codigo_inicial).subscribe({
                next: (data: any) => {
                  setTimeout(() => {
                    this.data = this.data.filter(producto => producto.codigoInicial !== this.codigo_inicial);
                    this.funct_retorna_productos();
                    this.message.add({ severity: 'success', summary: 'Info:', detail: 'Se ha eliminado un producto de la base de datos.', life: 3000 });
                  }, 1000)
                  this.cdr.detectChanges();
                }
              })
            }
          }
        })
      }
    });
  }
}
