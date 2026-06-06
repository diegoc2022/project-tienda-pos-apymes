import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import * as Swal from 'sweetalert2';
import { AperturaInventarioService } from './services/apertura-inventario.service';

@Component({
  selector: 'app-apertura-inventario',
  standalone: true,
  templateUrl: './apertura-inventario.html',
  styleUrl: './apertura-inventario.scss',
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
export class AperturaInventario {
  formId: FormGroup = new FormGroup({});
  date: Date = new Date();
  fecha_actual: any = '';

  constructor(
    private messageService: MessageService,
    private inventario: AperturaInventarioService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.formId = this.fb.group({
      id_inv: [null, Validators.required]
    });
    this.funct_retorna_id_inventario();
  }

  funct_retorna_id_inventario() {
    this.inventario.funct_retorna_id_inventario().subscribe({
      next: (data: any) => {
        const id_actual = Number(data[0].id_inventario);
        this.formId.setValue({ id_inv: id_actual });
        this.fecha_actual = data[0].update_at;

      }
    })
  }

  func_genera_id_inventario() {
    Swal.default.fire({
      title: '¿Está seguro?',
      text: 'Que desea generar un nuevo Id Inventario',
      icon: 'warning',
      width: '330px',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, lo voy a generar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventario.funct_retorna_id_inventario().subscribe({
          next: (data: any) => {
            const id_invent = Number(data[0].id_inventario) + 1
            this.inventario.funct_genera_id_inventario(data[0].id, id_invent).subscribe({
              next: (obj: any) => {
                this.funct_retorna_id_inventario();
                this.messageService.add({ severity: 'success', summary: 'Informativo:', detail: 'Se ha generado nuevo Id Inventario número: ' + data.id });
              }
            })
            this.cdr.detectChanges();
          }
        })
      }
    });

  }
}
