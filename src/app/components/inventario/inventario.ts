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
    MenuModule
  ],
  providers: [MessageService, InventarioService],
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
  tipo_inventario: string = '';
  id_tipo: number = 1;
  data_movimientos: any[] = [];
  tipo_motivo: string = 'inventario';
  formAjuste: FormGroup = new FormGroup({});
  formTipo: FormGroup = new FormGroup({});
  formCodigo: FormGroup = new FormGroup({});
  num_ajuste: any[] = [];
  name_ajuste: any = '';

  opciones = [
    { label: 'Producto vencido', value: 'Producto vencido' },
    { label: 'Producto dañado', value: 'Producto dañado' },
    { label: 'Producto perdido', value: 'Producto perdido' },
    { label: 'Ajuste de inventario', value: 'Ajuste inventario' }
  ];

  constructor(
    private vinculos: VinculosService,
    private products: ProductosService,
    private inventario: InventarioService,
    private message: MessageService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.visible = false;
    this.visible2 = false;
    this.funct_retorna_todos_los_productos();
    this.opcionSeleccionado = null

    this.formAjuste = this.fb.group({
      ajuste: [null, Validators.required]
    });

    this.formTipo = this.fb.group({
      tipo: [null, Validators.required]
    });

    this.formCodigo = this.fb.group({
      codigo: [null, Validators.required]
    });

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

  funct_retorna_producto() {
    const codigo = this.formCodigo.value.codigo;
    if (codigo) {
      this.codigo_producto = codigo;
    } else {
      this.codigo_producto = this.codigo_data;
    }

    this.vinculos.funct_retorna_vinculos(this.codigo_producto).subscribe({
      next: (data: any) => {
        const obj2 = JSON.parse(JSON.stringify(data));
        if (obj2.statusCode === 404) {
          this.message.add({ severity: 'warn', summary: 'Adventencia:', detail: 'El producto que acaba de leer, no existe o no se encuentra asociado', life: 3000 });
          this.formCodigo.reset();
          return;
        }

        this.data_movimientos.length = 0;
        this.num_ajuste.length = 0;
        this.data.length = 0;
        this.formCodigo.reset();
        this.data.push(obj2);
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
      case 'Producto vencido':
        this.tipo_inventario = 'Producto vencido';
        this.tipo_motivo = 'Merma';
        this.visible2 = true;
        this.id_tipo = 1;
        this.name_ajuste = 'Producto vencido';
        break;
      case 'Producto dañado':
        this.tipo_inventario = 'Producto dañado';
        this.tipo_motivo = 'Merma';
        this.visible2 = true;
        this.id_tipo = 2;
        this.name_ajuste = 'Producto dañado';
        break;
      case 'Producto perdido':
        this.tipo_inventario = 'Producto robado';
        this.tipo_motivo = 'Merma';
        this.visible2 = true;
        this.id_tipo = 3;
        this.name_ajuste = 'Producto perdido';
        break;
      case 'Ajuste inventario':
        this.tipo_inventario = 'Ajuste inventario';
        this.tipo_motivo = 'Ajuste';
        this.visible2 = true;
        this.id_tipo = 4;
        this.name_ajuste = 'Ajuste de inventario';
        break;
    }
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible2 = false;
    this.opcionSeleccionado = null;
    this.formAjuste.reset();
  }

  funct_retorna_todos_los_productos() {
    this.products.funct_retorna_full_productos().subscribe({
      next: (data: any) => {
        const objData = JSON.stringify(data);
        const obj = JSON.parse(objData);
        this.dataBuscaProductos = []
        for (let index = 0; index < obj.length; index++) {
          this.dataBuscaProductos.push(obj[index]);
        }
      }
    })
  }

  onRowSelect(event: any) {
    this.vinculos.funct_retorna_vinculos(event.data.codProd).subscribe({
      next: (data: any) => {
        const data2 = JSON.parse(JSON.stringify(data));
        if (data2.statusCode == 404) {
          this.message.clear();
          this.message.add({ severity: 'warn', summary: 'Adventencia:', detail: 'El producto que intenta agregar no existe o no se encuentra asociado', life: 3000 });
          return;
        }

        this.data_movimientos.length = 0;
        this.num_ajuste.length = 0;
        this.data.length = 0;
        this.data.push(data2);
        this.visible = false;
        this.cdr.detectChanges();
      }

    });
  }

  funct_actualiza_inventario() {
    if (this.formTipo.invalid) {
      this.formTipo.markAllAsTouched();
      this.message.add({ severity: 'warn', summary: 'Adventencia:', detail: 'Debe elegir "Tipo ajuste"', life: 3000 });
      return;
    }

    this.data_movimientos.length = 0;
    this.data_movimientos.push({
      "codProd": this.data[0][0].producto.codProd,
      "existencia": this.data[0][0].producto.existencia,
      "tipo": this.tipo_inventario,
      "id_tipo": this.id_tipo,
      "motivo": this.tipo_motivo,
      "ajuste": this.num_ajuste[0].ajuste,

    })

    this.inventario.funct_registra_movimientos_s(this.data_movimientos).subscribe({
      next: (data: any) => {
        this.vinculos.funct_retorna_vinculos(this.data[0][0].codigoInicial).subscribe({
          next: (data2: any) => {
            this.data_movimientos.length = 0;
            this.num_ajuste.length = 0;
            this.data.length = 0;
            this.opcionSeleccionado = null;
            this.formAjuste.reset();
            setTimeout(() => {
              this.data.push(data2);
              this.message.add({ severity: 'success', summary: 'Adventencia:', detail: 'Ajuste corregido exitasamente en el inventario', life: 3000 });
              const nextElement = (document.querySelector(`[formControlName="codigo"]`) as HTMLElement);
              nextElement.focus();
            }, 1000);
            this.cdr.detectChanges();
          }
        })
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
