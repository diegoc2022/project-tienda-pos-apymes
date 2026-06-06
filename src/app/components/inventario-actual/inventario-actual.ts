import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import * as Swal from 'sweetalert2';
import { InventarioService } from '../inventario/services/inventario.service';
import { ProductosService } from '../productos/services/productos.service';

@Component({
  selector: 'app-inventario-actual',
  standalone: true,
  templateUrl: './inventario-actual.html',
  styleUrl: './inventario-actual.scss',
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
export class InventarioActual {

  formId: FormGroup = new FormGroup({});
  date: Date = new Date();
  fecha_actual: any = '';
  inventario_actual: any[] = [];

  constructor(
    private messageService: MessageService,
    private inventario: InventarioService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private productos: ProductosService
  ) { }

  ngOnInit() {
    this.formId = this.fb.group({
      id_inv: [null, Validators.required]
    });
    //this.funct_retorna_id_inventario();
    this.funct_retorna_productos();
  }

  funct_retorna_productos() {
    this.productos.funct_retorna_full_productos().subscribe({
      next: (data: any) => {
        this.inventario_actual = []
        for (let index = 0; index < data.length; index++) {
          this.inventario_actual.push({
            codProd: data[index].codProd,
            descripcion: data[index].descripcion,
            stock_actual: data[index].existencia
          });
        }
        this.formId.setValue({ id_inv: data.length });
      }
    })
  }

  func_registra_inventario_actual() {
    Swal.default.fire({
      title: '¿Está seguro?',
      text: 'Que desea cargar el Stock Actual para realizar inventario',
      icon: 'warning',
      width: '340px',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cargar stock actual',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

      }
    });
  }
}
