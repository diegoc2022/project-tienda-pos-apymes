import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { MessageService } from 'primeng/api';
import { ProductosService } from '../productos/services/productos.service';
import { Html5Qrcode } from 'html5-qrcode'
import { InventarioService } from './services/inventario.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { InventarioActualService } from '../inventario-actual/services/inventario-actual.service';
import { AperturaInventarioService } from '../apertura-inventario/services/apertura-inventario.service';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-inventario',
  standalone: true,
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss',
  imports: [
    DialogModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ToastModule,
    MenuModule,
    InputIconModule,
    IconFieldModule
  ],
  providers: [MessageService, InventarioActualService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Inventario {
  @ViewChild('codigo') codigoInput!: ElementRef<HTMLInputElement>;
  data: any[] = [];
  codigo_data: string = '';
  codigo_producto: string = '';
  resultado: string | null = null;
  scannerRunning = false;
  qrScanner!: Html5Qrcode;
  opcionSeleccionado: any = null;
  selectedProduct1?: any;
  visible: boolean = false;
  visible2: boolean = false;
  dataBuscaProductos: any[] = [];
  selectedProduct2?: any[];
  id_tipo: any = '';
  data_movimientos: any[] = [];
  tipo_motivo: string = 'inventario';
  formAjuste: FormGroup = new FormGroup({});
  formTipo: FormGroup = new FormGroup({});
  formCodigo: FormGroup = new FormGroup({});
  num_ajuste: any[] = [];
  tipo_ajuste: any = '';
  id_inventario: number = 0;
  user: any = '';
  globalFilter: any = '';

  opciones = [
    { label: 'Stock completo', value: '1-SC' },
    { label: 'Ajuste por vencimiento', value: '2-APV' },
    { label: 'Ajuste por daños', value: '3-APD' },
    { label: 'Ajuste por robo', value: '4-APR' },
    { label: 'Ajuste por diferencias', value: '5-APD' }
  ];

  constructor(
    private vinculos: VinculosService,
    private products: ProductosService,
    private inventario: InventarioService,
    private inv_actual: AperturaInventarioService,
    private message: MessageService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.formAjuste = this.fb.group({
      ajuste: [null, Validators.required]
    });

    this.formTipo = this.fb.group({
      tipo: [null, Validators.required]
    });

    this.formCodigo = this.fb.group({
      codigo: [null, Validators.required]
    });

    this.visible = false;
    this.visible2 = false;
    this.funct_retorna_id_inventario();
    this.user = localStorage.getItem('user');
    this.funct_retorna_todos_los_productos();
    this.opcionSeleccionado = null;
    this.cdr.detectChanges();

  }

  ngOnDestroy() {
    this.detenerScanner();
  }

  activarScanner() {
    if (this.scannerRunning) return;

    this.qrScanner = new Html5Qrcode('qr-reader');

    this.qrScanner.start(
      { facingMode: 'environment' },
      {
        fps: 15,
        qrbox: { width: 220, height: 220 },
        disableFlip: true
      },
      (decodedText) => {
        if (this.codigo_data) return;
        this.codigo_data = decodedText;
        this.detenerScanner();
        this.funct_retorna_producto();


      },
      () => { }
    ).then(() => {
      this.scannerRunning = true;
    }).catch((err: any) => {
      console.error('Error activando cámara', err);
    });
  }

  detenerScanner() {
    if (!this.qrScanner || !this.scannerRunning) return;
    this.scannerRunning = false;
    this.qrScanner.stop().catch(() => { });
  }

  limpiarPantalla() {
    this.data_movimientos.length = 0;
    this.data.length = 0;
    this.detenerScanner();
    this.opcionSeleccionado = null;
    setTimeout(() => {
      const nextElement = (document.querySelector(`[formControlName="codigo"]`) as HTMLElement);
      nextElement.focus();
    }, 1000);
  }

  funct_retorna_id_inventario() {
    this.inv_actual.funct_retorna_id_inventario().subscribe({
      next: (data: any) => {
        this.id_inventario = 0;
        this.id_inventario = Number(data[0].id_inventario);
        this.cdr.detectChanges();
      }
    })
  }

  funct_retorna_producto() {
    const codigo = this.formCodigo.value.codigo;
    if (codigo) {
      this.codigo_producto = codigo;
    } else {
      this.codigo_producto = this.codigo_data;
    }

    this.vinculos.funct_retorna_codigo_inicial(this.codigo_producto).subscribe({
      next: (data: any) => {
        if (data.statusCode === 404) {
          this.message.add({ severity: 'warn', summary: 'Adventencia:', detail: 'El producto que acaba de leer, no existe o no se encuentra asociado', life: 3000 });
          this.formCodigo.reset();
          return;
        }

        this.data_movimientos.length = 0;
        this.num_ajuste.length = 0;
        this.data.length = 0;
        this.formCodigo.reset();
        this.data.push(data);
      }, error: (err: any) => {
        console.error('Error al consultar producto', err);

        // ejemplos de manejo
        if (err.status === 404) {
          this.message.add({ severity: 'warn', summary: 'Adventencia:', detail: 'El producto que acaba de leer, no existe o no se encuentra asociado', life: 3000 });
        } else {
          console.warn('Error inesperado');
        }

        // opcional: limpiar input
        this.formCodigo.reset();
      }
    });
  }

  onOpcionChange(event: any) {
    switch (event.value) {
      case '1-SC':
        this.visible2 = true;
        this.id_tipo = '1-SC';
        this.tipo_ajuste = 'Stock completo';
        break;
      case '2-APV':
        this.visible2 = true;
        this.id_tipo = '2-APV';
        this.tipo_ajuste = 'Ajuste por vencimiento';
        break;
      case '3-APD':
        this.visible2 = true;
        this.id_tipo = '3-APD';
        this.tipo_ajuste = 'Ajuste por daños';
        break;
      case '4-APR':
        this.visible2 = true;
        this.id_tipo = '4-APR';
        this.tipo_ajuste = 'Ajuste por robo';
        break;
      case '5-APD':
        this.visible2 = true;
        this.id_tipo = '5-AD';
        this.tipo_ajuste = 'Ajuste por diferencias';
        break;
    }
  }

  funct_show_dialog_producto() {
    this.visible = true;
  }

  funct_close_dialog_producto() {
    this.visible = false;
  }

  closeDialog() {
    this.visible2 = false;
    this.opcionSeleccionado = null;
    this.formAjuste.reset();
  }

  funct_retorna_todos_los_productos() {
    this.products.funct_retorna_full_productos().subscribe({
      next: (data: any) => {
        this.dataBuscaProductos = []
        for (let index = 0; index < data.length; index++) {
          this.dataBuscaProductos.push(data[index]);
        }
        this.cdr.detectChanges();
      }
    })
  }

  onRowSelect(event: any) {
    this.data = [];
    this.vinculos.funct_retorna_codigo_inicial(event.data.codProd).subscribe({
      next: (data: any) => {
        if (data.statusCode == 404) {
          this.message.clear();
          this.message.add({ severity: 'warn', summary: 'Adventencia:', detail: 'El producto que intenta agregar no se encuentra asociado', life: 3000 });
          return;
        }
        this.data_movimientos.length = 0;
        this.num_ajuste.length = 0;
        this.data.push(data);
        this.visible = false;
      }
    });
    this.visible = false;
    this.cdr.detectChanges();
  }

  funct_actualiza_inventario() {
    if (this.formTipo.invalid) {
      this.formTipo.markAllAsTouched();
      this.message.add({ severity: 'warn', summary: 'Adventencia:', detail: 'Debe elegir "Tipo ajuste"', life: 3000 });
      return;
    }

    this.data_movimientos.length = 0;
    this.data_movimientos.push({
      "id_inventario": this.id_inventario,
      "codprod": this.data[0][0].producto.codProd,
      "descripcion": this.data[0][0].producto.descripcion,
      "stock_actual": this.data[0][0].producto.existencia,
      "stock_despues": this.num_ajuste[0].ajuste,
      "id_tipo": this.id_tipo,
      "nombre_tipo": this.tipo_ajuste,
      "vendedor": this.user
    })

    this.inventario.funct_registra_inventario(this.data_movimientos).subscribe({
      next: (data: any) => {

        setTimeout(() => {
          const codigo_inic = this.data[0][0].codigoInicial
          this.vinculos.funct_retorna_codigo_inicial(codigo_inic).subscribe({
            next: (data2: any) => {
              this.data_movimientos.length = 0;
              this.num_ajuste.length = 0;
              this.data.length = 0;
              this.opcionSeleccionado = null;
              this.formAjuste.reset();
              this.data.push(data2);
              const nextElement = (document.querySelector(`[formControlName="codigo"]`) as HTMLElement);
              nextElement.focus();
              this.message.add({ severity: 'success', summary: 'Adventencia:', detail: 'Ajuste corregido exitasamente en el inventario', life: 3000 });
              this.cdr.detectChanges();
            }
          })
        }, 1000)
      }
    })
  }

  funct_agrega_ajuste() {
    this.num_ajuste.push({
      "ajuste": this.formAjuste.value.ajuste
    })
    this.visible2 = false;
  }
}
