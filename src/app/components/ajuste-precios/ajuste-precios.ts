import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { VentasSerivice } from '../form-ventas/services/ventas.serivice';
import { CheckboxModule } from 'primeng/checkbox';
import { ComprasService } from '../compras/services/compras.service';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-ajuste-precios',
  standalone: true,
  templateUrl: './ajuste-precios.html',
  styleUrl: './ajuste-precios.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    CheckboxModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AjustePrecios {
  data: FormGroup = new FormGroup({});
  @ViewChild('codigo') codigo?: ElementRef;
  @ViewChild('precio') precio?: InputNumber;
  codigo_prod?: string;
  fecha_actual?: string;
  date: Date = new Date();
  habilitado: boolean = false;
  onChecked: boolean = false;
  placeholder: string = 'Lea código';
  placeholder2: string = 'Digite precio venta';

  constructor(
    private fb: FormBuilder,
    private vinculos: VinculosService,
    private message: MessageService,
    private editar: VentasSerivice,
    private compras: ComprasService
  ) { }

  ngOnInit(): void {
    this.data = this.fb.group({
      codigo: [null, Validators.required],
      precio: [null, Validators.required],
      check: [null, Validators.required]
    });
    this.habilitado = false;
    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm');
  }

  onEnterPressed(event: KeyboardEvent) {
    this.codigo_prod = '';
    if (event.key === 'Enter') {
      this.vinculos.funct_retorna_vinculos(this.data.value.codigo).subscribe({
        next: (data: any) => {
          const objData = JSON.stringify(data);
          const obj = JSON.parse(objData);
          this.codigo_prod = obj[0].producto.codProd;
          const nativeInput = this.precio?.input?.nativeElement;
          nativeInput?.focus();
        }
      })
    }
  }

  funct_edita_precios_c() {
    this.habilitado = true;
    if (this.onChecked == false) {
      this.editar.funct_edita_precio_ventas_s(this.codigo_prod, this.data.value.precio).subscribe({
        next: (data: any) => {
          this.message.add({ severity: 'success', summary: 'Successful', detail: 'Precio editado correctamente' });
          this.data.get('codigo')?.setValue('');
          this.data.get('precio')?.setValue('');
          setTimeout(() => {
            this.habilitado = false;
            const nextElement = (document.querySelector(`[formControlName="codigo"]`) as HTMLElement);
            nextElement.focus();
          }, 2000)
        }
      });
    } else {
      this.compras.funct_edita_precio_compras_s(this.codigo_prod, this.data.value.precio).subscribe({
        next: (data: any) => {
          this.message.add({ severity: 'success', summary: 'Successful', detail: 'Precio editado correctamente' });
          this.data.get('codigo')?.setValue('');
          this.data.get('precio')?.setValue('');
          setTimeout(() => {
            this.habilitado = false;
            this.onChecked = false;
            const nextElement = (document.querySelector(`[formControlName="codigo"]`) as HTMLElement);
            nextElement.focus();
          }, 2000)
        }
      });
    }

  }

  onCheckboxChange(event: any) {
    if (event.checked == true) {
      this.onChecked = event.checked;
      this.placeholder = 'Lea código';
      this.placeholder2 = 'Digite precio compra';
    } else {
      this.onChecked = false;
      this.placeholder = 'Lea código';
      this.placeholder2 = 'Digite precio venta';
    }
  }

}
