import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { VinculosService } from './services/vinculos.service';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-vinculos',
  standalone: true,
  templateUrl: './vinculos.html',
  styleUrl: './vinculos.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule
  ],
  providers: [MessageService, VinculosService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Vinculos {
  @ViewChild('codigoVinc') siguienteInput?: ElementRef;
  @ViewChild('codigoInic') siguienteInput2?: ElementRef;
  fecha_actual?: string;
  date: Date = new Date();
  data: FormGroup = new FormGroup({});
  onChecked?: boolean;
  placeholder: string = 'Lea código nuevo';
  placeholder2: string = 'Lea código existente';
  codigosVinculos: any[] = [];

  constructor(
    private vinculos: VinculosService,
    private message: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.data = this.fb.group({
      codigoInic: [null, Validators.required],
      codigoVinc: [null, Validators.required],
      activaAsoc: [null]
    });
    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm');
  }

  on_enter_codigo_producto(event: any): void {
    if (event.code == "Enter") {
      this.vinculos.funct_retorna_vinculos(this.data.value.codigoVinc).subscribe({
        next: (data: any) => {
          const objData = JSON.stringify(data);
          const obj = JSON.parse(objData);
          console.log("Obj:: ", obj);
          if (obj.length > 0) {
            console.log("Data:: ", data);
            this.data.get('codigoVinc')?.setValue(" ");
            this.data.get('codigoVinc')?.setValue(obj[0].codigoVinculo);
          } else {
            this.data.get('codigoVinc')?.setValue(this.data.value.codigoVinc);
          }
        },
        error: (error: any) => {
          this.message.add({ severity: 'error', summary: 'Error 1:', detail: error, life: 5000 });
        }
      })
    }
  }

  funcRegistraVinculos() {
    if (this.data.invalid) {
      this.data.markAllAsTouched();
      for (const key in this.data.controls) {
        this.data.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'Para asociar un producto, debe completar todos los campos' });
      return;
    }

    if (this.onChecked == true) {
      this.vinculos.func_activa_asociacion_unidad_s(this.data.value.codigoInic, this.onChecked).subscribe({
        next: (data: any) => {
          this.vinculos.funct_registra_vinculos_s(this.data.value).subscribe({
            next: (obj2: any) => {
              if (obj2.code != 409) {
                this.data.get('codigoInic')?.setValue('');
                const nextElement = (document.querySelector(`[formControlName="codigoInic"]`) as HTMLElement);
                nextElement.focus();
                this.message.add({ severity: 'success', summary: 'Informativo::', detail: 'Vinculo creado exitosamente', life: 3000 });
              } else {
                this.message.add({ severity: 'error', summary: 'Advertencia 1:', detail: obj2.msg, life: 3000 });
              }
            }, error: (error: any) => {
              this.message.add({ severity: 'error', summary: 'Advertencia 2:', detail: error, life: 3000 });
            }
          })
        }
      })
    } else {
      this.vinculos.funct_registra_vinculos_s(this.data.value).subscribe({
        next: (obj2: any) => {
          if (obj2.code != 409) {
            this.data.get('codigoInic')?.setValue('');
            const nextElement = (document.querySelector(`[formControlName="codigoInic"]`) as HTMLElement);
            nextElement.focus();
            this.message.add({ severity: 'success', summary: 'Informativo::', detail: 'Vinculo creado exitosamente', life: 3000 });
          } else {
            this.message.add({ severity: 'error', summary: 'Advertencia 1:', detail: obj2.msg, life: 3000 });
          }
        }
      })
    }
  }

  onEnterPressed(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const nextElement = (document.querySelector(`[formControlName="codigoVinc"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  onCheckboxChange(event: any) {
    if (event.checked == true) {
      this.onChecked = event.checked;
      this.placeholder = 'Lea código paquete';
      this.placeholder2 = 'Lea código unidad';
    } else {
      this.onChecked = false;
      this.placeholder = 'Lea código nuevo';
      this.placeholder2 = 'Lea código existente';
    }
  }

  funct_elimina_vinculos() {
    this.codigosVinculos.push({
      codigoInicial: this.data.value.codigoInic,
      codigoVinculo: this.data.value.codigoVinc
    })
    this.vinculos.funct_elimina_vinculos_s(this.codigosVinculos).subscribe({
      next: (obj2: any) => {
        if (obj2.affected > 0) {
          this.data.get('codigoInic')?.setValue('');
          this.data.get('codigoVinc')?.setValue('');
          const nextElement = (document.querySelector(`[formControlName="codigoVinc"]`) as HTMLElement);
          nextElement.focus();
          this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'Vínculo eliminado exitosamente', life: 3000 });
        } else {
          this.message.add({ severity: 'error', summary: 'Advertencia:', detail: obj2.msg, life: 3000 });
        }
      }
    })
  }
}
