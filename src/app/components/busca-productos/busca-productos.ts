import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subscription, Table } from 'dexie';
import { AperturaCajaService } from '../apertura-caja/services/apertura-caja.service';
import { MessageService } from 'primeng/api';
import { VentasSerivice } from '../form-ventas/services/ventas.serivice';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ProductosService } from '../productos/services/productos.service';
import { FormVentas } from '../form-ventas/form-ventas';

@Component({
  selector: 'app-busca-productos',
  standalone: true,
  templateUrl: './busca-productos.html',
  styleUrl: './busca-productos.scss',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    CommonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    InputIconModule,
    IconFieldModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuscaProductos {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @ViewChild('dt2') dt2?: Table;
  dataBuscaProductos: any[] = [];
  selectedProduct1?: any[];
  dataService$?: Subscription;
  loading: boolean = false;
  origen_ventas: string = 'Ventas-1';
  openventas: string = 'abierto1';
  closeventas: string = 'cerrado1';
  idApertCaja?: number;
  idVentas: number = 0;
  prefijo_rem: string = '';
  codigo: string = '';
  user: any;
  globalFilter = ''


  constructor(
    private message: MessageService,
    private vinculos: VinculosService,
    private ventas: VentasSerivice,
    private apertura: AperturaCajaService,
    private productos: ProductosService,
    private cdr: ChangeDetectorRef,
    private formventas: FormVentas
  ) { }

  ngOnInit() {
    this.user = localStorage.getItem('user');
    this.funct_retorna_productos();
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    //this.venta_forms.funct_retorna_ventas();
  }

  funct_retorna_productos() {
    this.productos.funct_retorna_full_productos().subscribe({
      next: (data: any) => {
        this.dataBuscaProductos = []
        for (let index = 0; index < data.length; index++) {
          this.dataBuscaProductos.push(data[index]);
        }
      }
    })
  }

  onRowSelect(event: any) {
    this.vinculos.funct_retorna_vinculo_productos(event.data.codProd).subscribe({
      next: (result: any) => {
        if (result[0].producto != null) {
          let factura = localStorage.getItem('factura');
          this.apertura.funct_retorna_apertura_caja(this.user).subscribe({
            next: (data: any) => {
              const obj = JSON.parse(JSON.stringify(data));
              this.ventas.funct_registra_ventas_temp(result[0].producto, this.origen_ventas, this.openventas, obj.id_caja, factura).subscribe({
                next: (resp: any) => {
                  this.formventas.funct_retorna_ventas();
                  this.formventas.functInpuFocus();
                  this.visible = false;
                  this.message.add({ severity: 'info', summary: 'Product Selected', detail: 'Acaba de agregar un producto mas en la lista de compras', life: 3000 });
                }, error: (any: any) => {
                  console.log("Error: error");
                }
              });
            }
          })
          this.cdr.detectChanges();

        } else {
          this.message.add({ severity: 'error', summary: 'Product Selected', detail: 'El producto que intenta vender no existe en base de datos', life: 3000 });
        }
      }

    });
  }

  clear(table: Table) {
    table.clear();
  }

  ngOnDestroy(): void {
    this.dataService$?.unsubscribe();
  }

}
