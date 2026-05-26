import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';
import { VentasSerivice } from '../form-ventas/services/ventas.serivice';
import { SecuenciaService } from '../secuencias/services/secuencia.service';
import { MessageService } from 'primeng/api';
import { ImprimeService } from './services/imprime.service';
import { InventarioService } from '../inventario/services/inventario.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { FormVentas } from '../form-ventas/form-ventas';

@Component({
  selector: 'app-detalle-factura',
  standalone: true,
  templateUrl: './detalle-factura.html',
  styleUrl: './detalle-factura.scss',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    DialogModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetalleFactura implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  form: FormGroup = new FormGroup({});
  ventasProductos: any[] = [];
  venta_total: number = 0;
  total_efectivo: number = 0;
  total_cambio: number = 0;
  dataService$?: Subscription;
  dataObj?: any;
  idSecuencia: any[] = [];

  constructor(
    private imprime_fact: ImprimeService,
    private messageService: MessageService,
    private secuencia: SecuenciaService,
    private ventas: VentasSerivice,
    private fb: FormBuilder,
    private inventario: InventarioService,
    private cdr: ChangeDetectorRef,
    private formventas: FormVentas
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      efectivo: [0]
    });
    this.visible = false;
    this.funct_retorna_factura_c();
    this.formventas.funct_retorna_factura_c();
  }


  functRetornaVentas() {
    this.venta_total = 0;
    this.ventas.funct_retorna_ventas_temp().subscribe({
      next: (resp: any) => {
        const data = Array.isArray(resp) ? resp : [];
        this.ventasProductos = data.filter(
          (item: any) =>
            item.estado === 'abierto1'
        );
        this.venta_total = this.ventasProductos.reduce(
          (total: number, item: any) => total + item.subtotal,
          0
        );
        this.cdr.detectChanges();
      }, error: (error) => {
        console.error('Error al retornar ventas:', error);
      }
    });

  }

  funct_consulta_ventas_temp() {
    this.functRetornaVentas();
    this.funct_retorna_factura_c();
  }

  funct_calcula_efectivo() {
    const efectivo = this.form.value.efectivo
    if (efectivo > this.venta_total) {
      this.total_cambio = parseInt(this.form.value.efectivo) - this.venta_total;
      return;
    }
    this.total_cambio = 0;
    this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: 'Debe ingresar un valor mayor a total a pagar' });
  }

  functImprimeFacturas() {
    const numFactura = localStorage.getItem('factura')
    this.imprime_fact.funct_imprime_facturas(numFactura);
  }

  funct_retorna_factura_c() {
    const numFactura = Number(localStorage.getItem('factura'));
    this.idSecuencia.length = 0;
    this.idSecuencia.push({
      numero_factura: numFactura,
    })
  }

  funct_close_detalle_factura() {
    this.ventas.funct_close_ventas_estado(this.ventasProductos).pipe(
      switchMap(() =>
        this.inventario.funct_registra_salidas_s(this.ventasProductos)
      ),
      switchMap(() =>
        this.secuencia.funct_genera_factura_s(this.idSecuencia)
      )
    ).subscribe({
      next: () => {
        this.visible = false;
        this.formventas.funct_retorna_factura_c();
        setTimeout(() => {
          this.formventas.funct_retorna_ventas();
          this.formventas.functInpuFocus();
        }, 1000)
        this.total_efectivo = 0;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error("Error:", error);
      }
    });
  }

  ngOnDestroy(): void {
    this.dataService$?.unsubscribe();
  }

  funt_close_dialog_detalle_factura() {
    this.visible = false;
  }

}
