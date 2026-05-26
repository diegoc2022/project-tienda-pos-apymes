import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormVentas } from '../form-ventas/form-ventas';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { VentasSerivice } from '../form-ventas/services/ventas.serivice';
import { AperturaCajaService } from '../apertura-caja/services/apertura-caja.service';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-otras-ventas',
  standalone: true,
  templateUrl: './otras-ventas.html',
  styleUrl: './otras-ventas.scss',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    InputNumberModule
  ],
})
export class OtrasVentas {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @ViewChild(FormVentas) venta_forms!: FormVentas;
  @ViewChild('precio_venta') numInput?: InputNumber;
  data: FormGroup = new FormGroup({});
  data2: FormGroup = new FormGroup({});
  objData: any[] = [];
  selectedProduct1?: any;
  visibleEnc: boolean = false;
  dataService$?: Subscription;
  origen_venta: string = 'Ventas-1';
  openventas: string = 'abierto1';
  closeventas: string = 'cerrado1';
  idApertCaja?: number;
  idVentas: number = 0;
  factura: number = 0;
  user: any;

  constructor(
    private message: MessageService,
    private vinculos: VinculosService,
    private ventas: VentasSerivice,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private apertura: AperturaCajaService,
    private formventas: FormVentas
  ) { }

  ngOnInit() {
    this.data = this.fb.group({
      dlCodProducto: [null, Validators.required]
    });

    this.data2 = this.fb.group({
      codProd: [null, Validators.required],
      descripcion: [null, Validators.required],
      existencia: [null, Validators.required],
      cant: [null, Validators.required],
      precio_venta: [null, Validators.required],
      precio_compra: 1
    });
    this.user = localStorage.getItem('user');
    this.cdr.detectChanges();
  }

  funct_retorna_producto() {
    this.vinculos.funct_retorna_vinculo_productos(this.data.value.dlCodProducto).subscribe({
      next: (result: any) => {
        this.objData.length = 0;
        if (result[0].producto != null) {
          this.objData.push({
            codProd: result[0].producto.codProd,
            descripcion: result[0].producto.descripcion,
            existencia: result[0].producto.existencia,
            cantidad: 1,
            precio_compra: 1,
            precio_venta: 0
          });
          this.data2.get('codProd')?.setValue(this.objData[0].codProd);
          this.data2.get('descripcion')?.setValue(this.objData[0].descripcion);
          this.data2.get('existencia')?.setValue(this.objData[0].existencia);
          this.data2.get('cant')?.setValue(1);
          this.data.setValue({ dlCodProducto: '' });
          const nativeInput = this.numInput?.input?.nativeElement;
          nativeInput?.focus();
        } else {
          this.message.add({ severity: 'error', summary: 'Product Selected', detail: 'El producto que intenta vender no existe en base de datos' });
        }

      }
    })
  }

  functRegistraVenta() {
    let factura = localStorage.getItem('factura');
    this.apertura.funct_retorna_apertura_caja(this.user).subscribe({
      next: (data: any) => {
        console.log("Data", this.data2.value);

        this.ventas.funct_registra_ventas_temp(this.data2.value, this.origen_venta, this.openventas, data.id_caja, factura).subscribe({
          next: datar => {
            this.objData.length = 0;
            this.data.reset();
            this.data2.get('codProd')?.setValue('');
            this.data2.get('descripcion')?.setValue('');
            this.data2.get('existencia')?.setValue('');
            this.data2.get('cant')?.setValue('');
            this.data2.get('precio_venta')?.setValue('');
            this.formventas.funct_retorna_ventas();
          }
        })
      }
    })


  }

  ngOnDestroy(): void {
    this.dataService$?.unsubscribe();
  }

  functInpuFocus() {
    this.numInput?.input?.nativeElement.focus();
  }

}
