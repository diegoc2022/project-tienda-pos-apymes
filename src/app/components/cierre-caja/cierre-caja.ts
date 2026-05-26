import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { AperturaCajaService } from '../apertura-caja/services/apertura-caja.service';
import { Router } from '@angular/router';
import { CierreCajaService } from './services/cierre-caja.service';
import { VentasSerivice } from '../form-ventas/services/ventas.serivice';

@Component({
  selector: 'app-cierre-caja',
  standalone: true,
  templateUrl: './cierre-caja.html',
  styleUrl: './cierre-caja.scss',
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
export class CierreCaja {
  formId: FormGroup = new FormGroup({});
  ventasProductos: any[] = [];
  venta_total: number = 0;
  total_efectivo: number = 0;
  total_cambio: number = 0;
  idCaja: number = 0;
  form_fecha: Date = new Date();
  fecha_actual?: string;
  ventasData: any[] = [];
  total_varios: number = 0;
  base_caja: number = 0;
  total_ventas_dia: any[] = [];
  otras_ventas: number = 0;
  total_gastos: number = 0;
  user: any;

  constructor(
    private ventas: VentasSerivice,
    private apertura: AperturaCajaService,
    private cuadreCaja: CierreCajaService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.formId = this.fb.group({
      idCaja: [null, Validators.required]
    });
    this.user = localStorage.getItem('user');
    this.funct_retorna_apertura_caja();
  }

  funct_retorna_apertura_caja() {
    this.apertura.funct_retorna_apertura_caja(this.user).subscribe({
      next: (data: any) => {
        const obj = JSON.parse(JSON.stringify(data));
        this.idCaja = 0;
        this.fecha_actual = '';
        this.base_caja = 0;
        this.idCaja = obj.id_caja;
        this.fecha_actual = obj.fecha_registro.substring(0, 10)
        this.base_caja = obj.total_base;
        this.cdr.detectChanges();
      }
    })
  }

  funct_retorna_ventas_del_dia() {
    return this.ventas.funct_retorna_ventas_id_caja(this.formId.value.idCaja).subscribe({
      next: (data: any) => {
        const objData = JSON.stringify(data);
        const result = JSON.parse(objData);
        this.ventasData.length = 0;
        this.total_ventas_dia.length = 0,
          this.total_varios = 0;
        this.otras_ventas = 0;
        for (let index = 0; index < result.length; index++) {
          this.ventasData.push(result[index]);
          if (result[index].codProd == 'F10') {
            this.otras_ventas += result[index].subtotal
          } else if (result[index].codProd == 'F11') {
            this.total_gastos += result[index].subtotal
          } else {
            this.total_varios += result[index].subtotal
          }
        }
        this.total_ventas_dia.push({
          total: this.total_varios,
          base: this.base_caja,
          otrasv: this.otras_ventas,
          gastos: this.total_gastos,
          fecha: this.fecha_actual
        })

      }
    })
  }

  functImprimeCuadreCaja() {
    this.funct_retorna_apertura_caja()
    this.funct_retorna_ventas_del_dia()
    setTimeout(() => {
      this.cuadreCaja.functImprimeCuadreCajaService(this.total_ventas_dia);
    }, 1000)
  }

  funct_nex_model_exportar() {
    this.router.navigate(['/menu/migrar-ventas'])
  }

}
