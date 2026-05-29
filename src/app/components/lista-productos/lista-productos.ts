import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { formatearFecha } from '../formato-fecha/formato-fecha';
import { ProductosService } from '../productos/services/productos.service';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { MessageService } from 'primeng/api';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.scss',
  imports: [
    ToastModule,
    TableModule,
    CommonModule,
    ButtonModule,
    ProgressBarModule

  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListaProductos {
  data: any[] = [];
  codigo_inicial: any;
  codigo_vinculo: any;
  habilitado: boolean = false;
  visible: boolean = false;
  constructor(
    private productos: ProductosService,
    private vinculos: VinculosService,
    private message: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.visible = false;
  }

  funct_retorna_productos() {
    this.visible = true;
    this.productos.funct_retorna_full_productos().subscribe({
      next: (data: any) => {
        console.log("data: ", data);
        this.data.length = 0;
        for (let index = 0; index < data.length; index++) {
          this.data.push({
            codprod: data[index].codProd,
            descripcion: data[index].descripcion,
            existencia: data[index].existencia,
            precio_venta: data[index].precio_venta,
            createAt: formatearFecha(data[index].createAt),
            updated_at: formatearFecha(data[index].updated_at),
          })
        }
        this.habilitado = true;
        this.visible = false;
      }
    })
  }

  funct_elimina_productos(data: any) {
    this.codigo_inicial = data.codigoInicial;
    this.codigo_vinculo = data.codigoVinculo;
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Que desea eliminar el producto con código: ' + data.codigoInicial + ' de la base de datos',
      icon: 'warning',
      width: '330px',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.vinculos.funct_retorna_vinculos(this.codigo_vinculo).subscribe({
          next: (data: any) => {
            const objData = JSON.stringify(data);
            const obj = JSON.parse(objData);
            if (obj.length > 0) {
              // Si hay vínculos, eliminarlos primero
              this.vinculos.funct_elimina_vinculos_s(obj).subscribe({
                next: (data: any) => {
                  // Después de eliminar vínculos, eliminar el producto
                  this.productos.funct_elimina_productos_s(this.codigo_inicial).subscribe({
                    next: (data: any) => {
                      setTimeout(() => {
                        this.data = this.data.filter(producto => producto.codigoInicial !== this.codigo_inicial);
                        //this.funct_retorna_productos();
                        this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'Se ha eliminado un producto de la base de datos.', life: 3000 });
                      }, 1000)
                      this.cdr.detectChanges();
                    }
                  })
                }
              })
            } else {
              // Si no hay vínculos, eliminar directamente el producto
              this.productos.funct_elimina_productos_s(this.codigo_inicial).subscribe({
                next: (data: any) => {
                  setTimeout(() => {
                    this.data = this.data.filter(producto => producto.codigoInicial !== this.codigo_inicial);
                    //this.funct_retorna_productos(); 
                    this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'Se ha eliminado un producto de la base de datos.', life: 3000 });
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
