import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [MenubarModule, RouterOutlet, ImageModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home {
  items: MenuItem[] = [];
  ngOnInit(): void {
    if (1) {
      this.items = [
        {
          label: 'Facturación',
          icon: 'pi pi-fw pi-dollar',
          styleClass: 'icon-color',
          items: [
            { label: 'Apertura de caja', icon: 'pi pi-fw pi-caret-right', routerLink: ['apertura-caja'] },
            { label: 'Cierre de caja', icon: 'pi pi-fw pi-caret-right', routerLink: ['cuadre-caja'] },
            { label: 'Realizar pagos', icon: 'pi pi-fw pi-caret-right', routerLink: ['realizar-pagos'] },
            { label: 'Consultar pagos', icon: 'pi pi-fw pi-caret-right', routerLink: ['consultar-pagos'] },
            { label: 'Consultar consumos', icon: 'pi pi-fw pi-caret-right', routerLink: ['consultar-consumo'] },
            { label: 'Facturación', icon: 'pi pi-fw pi-caret-right', routerLink: ['facturar'] },

          ]
        },
        {
          label: 'Compras',
          icon: 'pi pi-fw pi-folder-open',
          styleClass: 'icon-color',
          items: [
            { label: 'Compras', icon: 'pi pi-fw pi-caret-right', routerLink: ['compras'] },
            { label: 'Factura proveedor', icon: 'pi pi-fw pi-caret-right', routerLink: ['factura-proveedor'] },
          ]
        },
        {
          label: 'Maestros',
          icon: 'pi pi-desktop',
          styleClass: 'icon-color',
          items: [
            { label: 'Nuevo producto', icon: 'pi pi-fw pi-caret-right', routerLink: ['nuevo-producto'] },
            { label: 'Nuevo cliente', icon: 'pi pi-fw pi-caret-right', routerLink: ['nuevo-cliente'] },
            { label: 'Nuevo proveedor', icon: 'pi pi-fw pi-caret-right', routerLink: ['nuevo-proveedor'] },
            { label: 'Nuevo empleado', icon: 'pi pi-fw pi-caret-right', routerLink: ['nuevo-empleado'] },
            { label: 'Movimientos x mes', icon: 'pi pi-fw pi-caret-right', routerLink: ['movimientos'] },
            { label: 'Registrar gastos op', icon: 'pi pi-fw pi-caret-right', routerLink: ['registrar-gastos'] },
            { label: 'Pago nómina emp', icon: 'pi pi-fw pi-caret-right', routerLink: ['nomina'] },
          ]
        },
        {
          label: 'Inventario',
          icon: 'pi pi-objects-column',
          styleClass: 'icon-color',
          items: [
            { label: '1. Apertura inventario', icon: 'pi pi-fw pi-caret-right', routerLink: ['apertura-inventario'] },
            { label: '2. Cargar stock actual', icon: 'pi pi-fw pi-caret-right', routerLink: ['inventario-actual'] },
            { label: '3. Realizar inventario', icon: 'pi pi-fw pi-caret-right', routerLink: ['inventario-web'] },
            { label: '4. Consultar inventario', icon: 'pi pi-fw pi-caret-right', routerLink: ['consultar-inventario'] },
            { label: '5. Ajustar inventario', icon: 'pi pi-fw pi-caret-right', routerLink: ['ajustar-inventario'] },
          ]
        },
        {
          label: 'Otros',
          icon: 'pi pi-book',
          styleClass: 'icon-color',
          items: [
            { label: 'Asociaciar producto', icon: 'pi pi-fw pi-caret-right', routerLink: ['vinculos'] },
            { label: 'Ajuste de precio', icon: 'pi pi-fw pi-caret-right', routerLink: ['ajustar-precios'] },
            { label: 'Consultar gastos op', icon: 'pi pi-fw pi-caret-right', routerLink: ['consultar-gastos'] },
            { label: 'Consultar nómina', icon: 'pi pi-fw pi-caret-right', routerLink: ['consultar-nomina'] },
            { label: 'Productos BD', icon: 'pi pi-fw pi-caret-right', routerLink: ['productos'] },
            { label: 'Edita productos', icon: 'pi pi-fw pi-caret-right', routerLink: ['edita-productos'] },
          ]
        },
        {
          label: 'Seguridad',
          icon: 'pi pi-fw pi-lock',
          styleClass: 'icon-color',
          items: [
            { label: 'Cerrar sesion', icon: 'pi pi-fw pi-caret-right', routerLink: ['salir'] }
          ]
        }
      ];
    }

  }
}
