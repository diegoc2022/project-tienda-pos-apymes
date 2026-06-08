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
import { ToastModule } from 'primeng/toast';
import { format } from 'date-fns';

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
    IconFieldModule,
    ToastModule
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
  fecha_apertura: any = '';
  fecha_actual: any = ''
  date: Date = new Date

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
    this.fecha_apertura = localStorage.getItem('fecha_apertura');
    this.fecha_actual = format(this.date, 'yyyy-MM-dd');
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
    if (this.fecha_apertura != this.fecha_actual) {
      this.message.clear();
      this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'Para realizar una venta, primero debe crear apertura de caja', life: 5000 });
      return;
    }

    this.vinculos.funct_retorna_codigo_inicial(event.data.codProd).subscribe({
      next: (result: any) => {
        if (result.statusCode == 404) {
          this.message.clear();
          this.message.add({ severity: 'error', summary: 'Error:', detail: 'El producto que intenta agregar en el carrito, no se encuentra asociado', life: 3000 });
          return;
        }

        let factura = localStorage.getItem('factura');
        this.apertura.funct_retorna_apertura_caja(this.user).subscribe({
          next: (data: any) => {
            const obj = JSON.parse(JSON.stringify(data));
            this.ventas.funct_registra_ventas_temp(result[0].producto, this.origen_ventas, this.openventas, obj.id_caja, factura).subscribe({
              next: (resp: any) => {
                this.formventas.funct_retorna_ventas();
                this.formventas.functInpuFocus();
                this.visible = false;
                this.message.clear();
                this.message.add({ severity: 'info', summary: 'Product Selected', detail: 'Acaba de agregar un producto mas en la lista de compras', life: 3000 });
              }, error: (any: any) => {
                console.log("Error: error");
              }
            });
          }
        })
        this.cdr.detectChanges();
      }
    });
  }

}
