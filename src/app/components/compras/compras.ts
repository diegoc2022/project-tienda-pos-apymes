import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ComprasService } from './services/compras.service';
import { InventarioService } from '../inventario/services/inventario.service';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { ProductosService } from '../productos/services/productos.service';
import { of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-compras',
  standalone: true,
  templateUrl: './compras.html',
  styleUrl: './compras.scss',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    FormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    SelectModule,
    DialogModule,
    InputNumberModule,
    InputTextModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Compras {
  @ViewChild('varios') select?: Select;
  @ViewChild('codigo') codigo!: ElementRef;
  @ViewChild('miInputNumber') inputNumberRef!: InputNumber;
  @ViewChild('precioVenta') inputNumberRef2?: any;

  formCompras!: FormGroup;
  formCompras2!: FormGroup;
  formCompras3!: FormGroup;
  formCompras4!: FormGroup;
  formCompras5!: FormGroup;
  date: Date = new Date();
  fecha_actual?: string;
  sub_total_sin_iva: number = 0;
  total_descuento: number = 0;
  total_iva2: number = 0;
  total_icui: number = 0;
  costo_total_con_iva: number = 0;
  sub_total_con_desc: number = 0;
  consto_unidad_sin_iva: number = 0;
  consto_unidad_con_iva: number = 0;
  precio_venta_und_con_iva: number = 0;
  precio_venta: number = 0;
  utilidad: number = 0;
  valor_iva: number = 0;
  valor_icui: number = 0;
  sub_total_item_fact: number = 0;
  total_item_desc: number = 0;
  total_item_iva: number = 0;
  total_item_icui: number = 0;
  total_item_factura: number = 0;
  total_registros: number = 0;
  existencia: number = 0;
  codigo_prod: string = '';
  tipo_compra: any[] = [];
  total_factura: number = 0;
  display: boolean = false;
  products: any[] = [];
  products2: any[] = [];
  selectedProduct1: any[] = [];
  sub_total_form_fact: number = 0;
  total_form_desc: number = 0;
  total_form_iva: number = 0;
  total_form_icui: number = 0;
  total_form_factura: number = 0;
  habilitado: boolean = false;
  option_inventario: any[] = []
  data_compras: any[] = [];
  seleccionado: any = null;


  constructor(
    private fb: FormBuilder,
    private message: MessageService,
    private compras: ComprasService,
    private retornaVinculos: VinculosService,
    private inventario: InventarioService
  ) {
    this.tipo_compra = [
      { name: '100-Varios', code: '100' }
    ];
  }

  ngOnInit(): void {
    this.formCompras = this.fb.group({
      factura: ['', Validators.required],
      varios: ['', Validators.required]
    })

    this.formCompras2 = this.fb.group({
      codProd: [null, Validators.required],
      descrip: [null, Validators.required],
      precio_und: [null, Validators.required],
      cantidad: [null, Validators.required],
      costo_sin_iva: [null, Validators.required],
      desc: [null, Validators.required],
      total_desc: [null, Validators.required],
      iva: [null, Validators.required],
      totaliva: [null, Validators.required],
      icui: [null, Validators.required],
      totalicui: [null, Validators.required],
      total_costo: [null, Validators.required],
      costo_und: [null, Validators.required],
      utilidad: [null, Validators.required],
      precioVenta: [null, Validators.required]
    })

    this.formCompras3 = this.fb.group({
      total_descuento: [null, Validators.nullValidator],
      total_iva: [null, Validators.nullValidator],
      total_icui: [null, Validators.nullValidator],
      sub_total: [null, Validators.nullValidator],
      total_factura: [null, Validators.nullValidator],

    })

    this.formCompras4 = this.fb.group({
      total_descuento2: [null, Validators.nullValidator],
      total_iva2: [null, Validators.nullValidator],
      total_icui2: [null, Validators.nullValidator],
      sub_total2: [null, Validators.nullValidator],
      total_factura2: [null, Validators.nullValidator],

    })

    this.formCompras5 = this.fb.group({
      optCompras: [null, Validators.nullValidator]
    })

    this.option_inventario = [
      { name: 'SI', code: 1 },
      { name: 'NO', code: 2 }
    ]

    this.habilitado = false;
    this.funct_retorna_compras();
    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm:ss');
  }

  on_enter_factura(event: any): void {
    if (event.key == 'Enter' || event.code == 'Enter') {
      this.compras.funct_retorna_compras_facturas_s(this.formCompras.value.factura).subscribe({
        next: (data: any) => {
          const objData = JSON.stringify(data);
          const count = JSON.parse(objData);
          if (count > 0) {
            this.message.add({ severity: 'error', summary: 'Error: ', detail: 'Factura Nro: ' + this.formCompras.value.factura.toUpperCase() + ' ya existe en base de datos' });
          } else {
            if (this.select) {
              this.select.focus();
              this.select.show();
            }
          }
        },
        error: (error: any) => {
          this.message.add({ severity: 'error', summary: 'Error_compras_h:', detail: error, life: 3000 });
          this.message.clear();
        }
      })
    }

  }

  on_codigo_producto() {
    setTimeout(() => {
      this.codigo.nativeElement.focus()
    });
  }

  on_enter_codigo_producto(event: any): void {
    if (event.key == 'Enter' || event.code == 'Enter') {
      this.retornaVinculos.funct_retorna_vinculos(this.formCompras2.value.codProd).subscribe({
        next: (data: any) => {
          const objData = JSON.stringify(data);
          const obj = JSON.parse(objData);
          if (obj.length > 0) {
            this.formCompras2.get('codProd')?.setValue(" ");
            this.formCompras2.get('codProd')?.setValue(obj[0].producto.codProd);
            this.formCompras2.get('descrip')?.setValue(obj[0].producto.descripcion);
            this.codigo_prod = obj[0].codigoProd2;
            this.existencia = parseInt(obj[0].producto.existencia);
            const nativeInput = this.inputNumberRef?.input?.nativeElement;
            nativeInput?.focus();
          } else {
            this.message.clear();
            this.message.add({ severity: 'error', summary: 'Product Selected', detail: 'Este producto no existe en base de datos, debe crearlo primero' });
          }
        },
        error: (error: any) => {
          this.message.clear();
          this.message.add({ severity: 'error', summary: 'Error_compras_h:', detail: error, life: 3000 });
        }
      })
    }
  }

  on_enter_precio_unitario(event: any): void {
    if (event.key == 'Enter' || event.code == 'Enter') {
      this.consto_unidad_sin_iva = this.formCompras2.value.precio_und;
      const nextElement = (document.querySelector(`[formControlName="cantidad"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  on_enter_cantidad(event: any): void {
    if (event.key == 'Enter' || event.code == 'Enter') {
      this.sub_total_sin_iva = this.formCompras2.value.precio_und * parseInt(this.formCompras2.value.cantidad);
      this.formCompras2.get('costo_sin_iva')?.setValue(this.sub_total_sin_iva);
      const nextElement = (document.querySelector(`[formControlName="desc"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  on_enter_sub_total(event: any): void {
    if (event.key == 'Enter' || event.code == 'Enter') {
      const nextElement = (document.querySelector(`[formControlName="desc"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  on_enter_descuento(event: any): void {
    if (event.key == 'Enter' || event.code == 'Enter') {
      if (this.formCompras2.value.precio_und > 0) {
        this.total_descuento = this.formCompras2.value.costo_sin_iva * this.formCompras2.value.desc / 100;
        this.formCompras2.get('total_desc')?.setValue(this.total_descuento.toFixed(2));
        const nextElement = (document.querySelector(`[formControlName="iva"]`) as HTMLElement);
        nextElement.focus();
      }
    }
  }

  on_enter_iva(event: any): void {
    if (event.key == 'Enter' || event.code == 'Enter') {
      if (this.formCompras2.value.precio_und > 0) {
        this.sub_total_con_desc = this.sub_total_sin_iva - this.total_descuento;
        this.total_iva2 = this.sub_total_con_desc * this.formCompras2.value.iva / 100;
        this.formCompras2.get('totaliva')?.setValue(this.total_iva2.toFixed(2));
        const nextElement = (document.querySelector(`[formControlName="icui"]`) as HTMLElement);
        nextElement.focus();

      }

    }
  }


  on_enter_icui(event: any): void {
    if (event.key == 'Enter' || event.code == 'Enter') {
      if (this.formCompras2.value.precio_und > 0) {
        this.sub_total_con_desc = this.sub_total_sin_iva - this.total_descuento;
        this.total_icui = this.sub_total_con_desc * this.formCompras2.value.icui / 100;
        this.costo_total_con_iva = this.sub_total_con_desc + this.total_iva2 + this.total_icui;
        this.valor_iva = this.consto_unidad_sin_iva * this.formCompras2.value.iva / 100;
        this.valor_icui = this.consto_unidad_sin_iva * this.formCompras2.value.icui / 100;
        this.consto_unidad_con_iva = this.consto_unidad_sin_iva + this.valor_iva + this.valor_icui;
        this.formCompras2.get('totalicui')?.setValue(this.total_icui.toFixed(2));
        this.formCompras2.get('total_costo')?.setValue(Math.round(this.costo_total_con_iva));
        this.formCompras2.get('costo_und')?.setValue(Math.round(this.consto_unidad_con_iva));
        this.sub_total_form_fact = Math.round(this.sub_total_item_fact) + Math.round(this.sub_total_con_desc);
        this.total_form_desc = Math.round(this.total_descuento);
        this.total_form_iva = Math.round(this.total_item_iva) + Math.round(this.total_iva2);
        this.total_form_icui = Math.round(this.total_item_icui) + Math.round(this.total_icui);
        this.total_form_factura = Math.round(this.total_item_factura) + Math.round(this.costo_total_con_iva)
        const nextElement = (document.querySelector(`[formControlName="utilidad"]`) as HTMLElement);
        nextElement.focus();
      }

    }
  }

  on_enter_total_costo(event: any): void {
    if (event.key == 'Enter' || event.code == 'Enter') {
      if (this.formCompras2.value.precio_und > 0) {
        const nextElement = (document.querySelector(`[formControlName="utilidad"]`) as HTMLElement);
        nextElement.focus();

      }

    }
  }

  on_enter_utilidad(event: any): void {
    if (event.key == 'Enter' || event.code == 'Enter') {
      this.utilidad = this.consto_unidad_con_iva * parseInt(this.formCompras2.value.utilidad) / 100
      this.precio_venta = this.consto_unidad_con_iva + this.utilidad;
      this.formCompras2.get('precioVenta')?.setValue(Math.round(this.precio_venta));
      const nativeInput = this.inputNumberRef2?.input?.nativeElement;
      nativeInput?.focus();
    }
  }


  funct_registra_compras() {
    if (this.formCompras.invalid || this.formCompras2.invalid) {
      this.formCompras.markAllAsTouched();
      this.formCompras2.markAllAsTouched();
      for (const key in this.formCompras.controls) {
        this.formCompras.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'warn', summary: 'Error:', detail: 'Para agregar una coompra, primero debe diligenciar todos los campos del formulario', life: 5000 });
      return;
    }

    this.habilitado = true;
    this.compras.funct_registra_compras_s(this.formCompras.value, this.formCompras2.value).subscribe({
      next: (data: any) => {
        this.formCompras2.get('codProd')?.setValue('');
        this.formCompras2.get('descrip')?.setValue('');
        this.formCompras2.get('precio_und')?.setValue('');
        this.formCompras2.get('cantidad')?.setValue('');
        this.formCompras2.get('costo_sin_iva')?.setValue('');
        this.formCompras2.get('desc')?.setValue('');
        this.formCompras2.get('total_desc')?.setValue('');
        this.formCompras2.get('iva')?.setValue('');
        this.formCompras2.get('totaliva')?.setValue('');
        this.formCompras2.get('icui')?.setValue('');
        this.formCompras2.get('totalicui')?.setValue('');
        this.formCompras2.get('total_costo')?.setValue('');
        this.formCompras2.get('costo_und')?.setValue('');
        this.formCompras2.get('utilidad')?.setValue('');
        this.formCompras2.get('precioVenta')?.setValue('');

        this.message.add({ severity: 'info', summary: 'Informativo', detail: 'Item compra agregado exitosamente' });
        this.funct_retorna_compras();
        setTimeout(() => {
          this.habilitado = false;
          const nextElement = (document.querySelector(`[formControlName="codProd"]`) as HTMLElement);
          nextElement.focus();
        }, 2000)
      }
    });
  }

  funct_retorna_compras() {
    this.compras.funct_retorna_compras_s().subscribe({
      next: (data: any) => {
        const objData = JSON.stringify(data);
        const obj = JSON.parse(objData);
        this.sub_total_item_fact = 0;
        this.total_item_desc = 0;
        this.total_item_iva = 0;
        this.total_item_icui = 0;
        this.total_item_factura = 0;
        this.products.length = 0;
        this.products2.length = 0;
        for (let index = 0; index < obj.length; index++) {
          this.sub_total_item_fact += Math.round(obj[index].subtotal) - Math.round(obj[index].total_descuento);
          this.total_item_desc += Math.round(obj[index].total_descuento);
          this.total_item_iva += Math.round(obj[index].total_iva);
          this.total_item_icui += Math.round(obj[index].total_icui);
          this.total_item_factura += Math.round(obj[index].total_compras);
          this.products.push(obj[index]);
          if (obj[index].id) {
            const { id, ...rest } = obj[index]; // eliminamos `id`
            this.products2.push(rest);          // guardamos solo los demás campos
          }

        }
        this.total_registros = obj.length;
      },
      error: (error: any) => {
        this.message.add({ severity: 'error', summary: 'Error_compras:', detail: error, life: 3000 });
      }
    })
  }


  funct_elimina_item_compras(product: any) {
    this.compras.funct_elimina_item_compras_s(product).subscribe({
      next: (data: any) => {
        this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'Se ha eliminado un producto de la lista de compras.', life: 3000 });
        this.funct_retorna_compras();
        this.message.clear();
      },
      error: (error: any) => {
        this.message.add({ severity: 'error', summary: 'Error_compras:', detail: error, life: 3000 });
      }
    })
  }

  funct_registra_compras_historico() {
    const opcion = this.formCompras5.value.optCompras;
    if (opcion < 1) {
      this.message.add({
        severity: 'error',
        summary: 'Error:',
        detail: 'Debe elegir una opción para guardar',
        life: 3000
      });
      return;
    }

    this.habilitado = true;

    const guardarHistorico$ = this.compras.funct_guarda_compras_historico(this.products2);

    const actualizarInventario$ = () =>
      this.inventario.funct_edita_compras_inventario(this.products2);

    const crearFactura$ = () =>
      this.compras.funct_registra_factura_compra(this.products2);

    const eliminarTemp$ = () =>
      this.compras.funct_elimina_factura_compras_temp_s();

    guardarHistorico$.pipe(

      // Si opción = 1 → actualiza inventario, si no → lo omite
      switchMap(() => opcion === 1 ? actualizarInventario$() : of(null)),

      switchMap(() => crearFactura$()),

      tap(() => {
        this.message.add({
          severity: 'success',
          summary: 'Informativo:',
          detail: 'Los detalles de la factura fueron guardados exitosamente.',
          life: 3000
        });
      }),

      switchMap(() => eliminarTemp$()),

    ).subscribe({
      next: () => {
        // Reset UI
        this.habilitado = false;
        this.sub_total_form_fact = 0;
        this.total_form_desc = 0;
        this.total_form_iva = 0;
        this.total_form_icui = 0;
        this.total_form_factura = 0;

        this.funct_retorna_compras();
        this.display = false;

        this.formCompras.get('factura')?.setValue('');

        const nextElement = document.querySelector(
          `[formControlName="factura"]`
        ) as HTMLElement;

        nextElement?.focus();
      },

      error: (err: any) => {
        console.error(err);

        this.habilitado = false;

        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un problema al guardar la compra.',
          life: 4000
        });
      }
    });
  }


  show_dialog() {
    this.display = true;
  }

  openDialog() {
    this.display = false
  }


}
