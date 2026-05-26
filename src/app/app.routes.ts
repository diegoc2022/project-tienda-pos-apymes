import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { authGuard } from './auth.guard';
import { Home } from './components/home/home';
import { AjusteInventario } from './components/ajuste-inventario/ajuste-inventario';
import { Productos } from './components/productos/productos';
import { Proveedores } from './components/proveedores/proveedores';
import { CerrarSesion } from './components/cerrar-sesion/cerrar-sesion';
import { Vinculos } from './components/vinculos/vinculos';
import { AjustePrecios } from './components/ajuste-precios/ajuste-precios';
import { Inventario } from './components/inventario/inventario';
import { Clientes } from './components/clientes/clientes';
import { Empleados } from './components/empleados/empleados';
import { MovimientosXMes } from './components/movimientos-x-mes/movimientos-x-mes';
import { Gastos } from './components/gastos/gastos';
import { ConsultarGastos } from './components/consultar-gastos/consultar-gastos';
import { Nomina } from './components/nomina/nomina';
import { ConsultarNomina } from './components/consultar-nomina/consultar-nomina';
import { FacturaProveedor } from './components/factura-proveedor/factura-proveedor';
import { Compras } from './components/compras/compras';
import { AperturaCaja } from './components/apertura-caja/apertura-caja';
import { CierreCaja } from './components/cierre-caja/cierre-caja';
import { MigrarVentas } from './components/migrar-ventas/migrar-ventas';
import { PagosConsumos } from './components/pagos-consumos/pagos-consumos';
import { ConsultarPagos } from './components/consultar-pagos/consultar-pagos';
import { ConsultarConsumos } from './components/consultar-consumos/consultar-consumos';
import { FormVentas } from './components/form-ventas/form-ventas';

export const routes: Routes = [
    { path: '', title: 'login', component: Login },
    { path: 'inventario-web', title: 'Inventario', component: Inventario, canActivate: [authGuard] },
    {
        path: 'menu', component: Home, canActivate: [authGuard],
        children: [
            {
                path: 'ajustar-inventario', title: 'Ajustar inventario', component: AjusteInventario
            },
            {
                path: 'nuevo-producto', title: 'Crear producto', component: Productos
            },
            {
                path: 'nuevo-proveedor', title: 'Proveedor', component: Proveedores
            },
            {
                path: 'salir', title: 'Cerrar sesion', component: CerrarSesion
            },
            {
                path: 'vinculos', title: 'Vinculos', component: Vinculos
            },
            {
                path: 'ajustar-precios', title: 'Ajustar precios', component: AjustePrecios
            },
            {
                path: 'inventario-web', title: 'Inventario', component: Inventario,
            },
            {
                path: 'nuevo-cliente', title: 'Crear cliente', component: Clientes
            },
            {
                path: 'nuevo-empleado', title: 'Empleados', component: Empleados,
            },
            {
                path: 'movimientos', title: 'Movimientos x mes', component: MovimientosXMes
            },
            {
                path: 'registrar-gastos', title: 'Gastos', component: Gastos,
            },
            {
                path: 'consultar-gastos', title: 'Consultar gastos', component: ConsultarGastos,
            },
            {
                path: 'nomina', title: 'Pago nómina', component: Nomina,
            },
            {
                path: 'consultar-nomina', title: 'Consultar pago nómina', component: ConsultarNomina,
            },
            {
                path: 'factura-proveedor', title: 'Consultar facturas', component: FacturaProveedor
            },
            {
                path: 'compras', title: 'Compras', component: Compras
            },
            {
                path: 'apertura-caja', title: 'Apertura de caja', component: AperturaCaja
            },
            {
                path: 'cuadre-caja', title: 'Cierre de caja', component: CierreCaja
            },
            {
                path: 'migrar-ventas', title: 'Migrar ventas', component: MigrarVentas,
            },
            {
                path: 'realizar-pagos', title: 'Realizar pagos', component: PagosConsumos,
            },
            {
                path: 'consultar-pagos', title: 'Consultar pagos', component: ConsultarPagos,
            },
            {
                path: 'consultar-consumo', title: 'Consultar consumo', component: ConsultarConsumos,
            },
            {
                path: 'facturar', title: 'Facturación', component: FormVentas
            },
        ]
    }
];
