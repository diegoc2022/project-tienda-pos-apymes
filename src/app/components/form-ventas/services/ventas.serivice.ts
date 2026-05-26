import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Environment from '../../../../environments/environment';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class VentasSerivice {
  private URL?: string;
  private API?: string;
  private API2?: string;
  private API3?: string;
  private API4?: string;
  cantidad?: number;
  total?: number;
  form_fecha: Date = new Date();
  subtotal?: number;

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'editar';
    this.API2 = 'ventas-historicos';
    this.API3 = 'ventas-temp';
    this.API4 = 'close-ventas';
  }


  funct_edita_precio_ventas_s(cod: any, data: any) {
    return this.http.patch(`${this.URL}/${this.API}/precioVentas/${cod}`, {
      "precio_venta": data
    });
  }

  func_activa_asociacion_unidad_s(cod: any, estado: boolean): Observable<any> {
    return this.http.patch(`${this.URL}/${this.API}/activar/${cod}`, {
      "venta_por_und": estado
    });
  }

  funct_edita_nombre_producto_s(data: any) {
    return this.http.patch(`${this.URL}/${this.API}/producto/${data.codInicial}`, {
      "descripcion": data.codNuevo.toUpperCase()
    });
  }

  funct_registra_ventas_historicos(data: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.URL}/${this.API2}`, data);
  }

  funct_retorna_ventas_historicos_s(num_es: any, num_year: any) {
    return this.http.get(`${this.URL}/${this.API2}/${num_es}/${num_year}`);
  }

  funct_retorna_ventas_temp() {
    return this.http.get(`${this.URL}/${this.API3}`);
  }

  funct_retorna_ventas_id_caja(id: number) {
    return this.http.get(`${this.URL}/${this.API3}/${id}`);
  }

  funct_retorna_ventas_facturas(id: any) {
    return this.http.get(`${this.URL}/${this.API3}/factura/${id}`)
  }

  funct_elimina_ventas_temporal() {
    return this.http.delete(`${this.URL}/${this.API3}/ventas-temp/eliminar-todo`);
  }

  funct_edita_cantidad_venta_s(data: any) {
    this.subtotal = data.cantidad * data.precio_venta;
    return this.http.patch(`${this.URL}/${this.API3}/${data.id}/${data.codProd}`, {
      "cantidad": data.cantidad,
      "subtotal": this.subtotal
    });
  }

  funct_close_ventas_temp(data: any) {
    return this.http.patch(`${this.URL}${this.API3}${data.id}/${data.codProd}`, {
      "activo": true
    });
  }

  funct_close_ventas_estado(data: any): Observable<any> {
    return this.http.put(`${this.URL}/${this.API4}`, data);
  }

  funct_elimina_ventas_temp(data: any) {
    return this.http.delete(`${this.URL}/${this.API3}/item/${data.id}/${data.codProd}`);
  }

  funct_elimina_id_ventas(data: any): Observable<any> {
    return this.http.delete(`${this.URL}/${this.API3}/vent`, { body: data });
  }


  funct_registra_ventas_temp(registraVentas: any, data: any, accion: any, idCaja: any, fact: any): Observable<any> {
    this.cantidad = 1;
    const prefijo = 'C1-';
    const user = localStorage.getItem('user');
    this.total = this.cantidad * registraVentas.precio_venta;
    const fecha_actual = format(this.form_fecha, 'd-M-yyyy');
    const mes = format(this.form_fecha, 'M');
    const year = format(this.form_fecha, 'yyyy');
    const hora_actual = format(this.form_fecha, 'HH:mm');
    return this.http.post<any>(`${this.URL}/${this.API3}`, {
      "id_venta": prefijo + 0,
      "id_caja": idCaja,
      "codProd": registraVentas.codProd,
      "descripcion": registraVentas.descripcion,
      "cantidad": this.cantidad,
      "existencia": registraVentas.existencia,
      "precio_compra": registraVentas.precio_compra,
      "precio_venta": this.total,
      "origen_venta": data,
      "subtotal": this.total,
      "vendedor": user,
      "estado": accion,
      "factura": fact,
      "venta_por_und": registraVentas.venta_por_und,
      "num_mes": mes,
      "num_year": year,
      "fecha_registro": fecha_actual,
      "hora_registro": hora_actual
    })

  }
}
