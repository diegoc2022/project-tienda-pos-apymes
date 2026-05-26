import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { AjusteInvService } from './services/ajuste-inv.service';
import { MessageService } from 'primeng/api';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajuste-inventario',
  standalone: true,
  templateUrl: './ajuste-inventario.html',
  styleUrls: ['./ajuste-inventario.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    ButtonModule
  ],
  providers: [MessageService, AjusteInvService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AjusteInventario {
  data: FormGroup = new FormGroup({});
  codigo_prod?: string;
  fecha_actual?: string;
  date: Date = new Date();
  habilitado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private vinculos: VinculosService,
    private inventario: AjusteInvService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.data = this.fb.group({
      codigo: [null, Validators.required],
      cantidad: [null, Validators.required]
    });
    this.habilitado = false;
    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm');
  }


  functEditaCantidad() {
    if (this.data.invalid) {
      this.data.markAllAsTouched();
      for (const key in this.data.controls) {
        this.data.controls[key].markAsDirty();
      }
      this.messageService.add({ severity: 'warn', summary: 'Error:', detail: 'Para ajustar inventario debe completar ambos campos', life: 5000 });
      return;
    }

    this.habilitado = true;
    this.inventario.funct_ajusta_inventario_s(this.codigo_prod, this.data.value.cantidad).subscribe({
      next: (data: any) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cantidad editada correctamente' });
        this.data.get('codigo')?.setValue('');
        this.data.get('cantidad')?.setValue('');
        setTimeout(() => {
          this.habilitado = false;
          const nextElement = (document.querySelector(`[formControlName="codigo"]`) as HTMLElement);
          nextElement.focus();
        }, 2000)
        this.cdr.detectChanges();
      }
    });
  }

  onEnterPressed(event: KeyboardEvent) {
    this.codigo_prod = '';
    if (event.key === 'Enter') {
      this.vinculos.funct_retorna_vinculos(this.data.value.codigo).subscribe({
        next: (data: any) => {
          const obj = JSON.stringify(data);
          const obj2 = JSON.parse(obj);
          this.codigo_prod = '';
          this.codigo_prod = obj2[0].producto.codProd;
          const nextElement = (document.querySelector(`[formControlName="cantidad"]`) as HTMLElement);
          nextElement.focus();
        }
      })
    }
  }
}
