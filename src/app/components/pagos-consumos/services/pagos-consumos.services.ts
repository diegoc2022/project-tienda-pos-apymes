import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagosConsumosServices {
  private URL?: string;
  private API?: string;
  private API2?: string;

  form_fecha: Date = new Date();

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'ventas-x-cobrar';
    this.API2 = 'pagos';
  }

  funct_registra_ventas_x_cobrar_s(data: any[], cod: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/${this.API}/${cod.cliente}/${cod.codigo_venta}`, data);
  }

  funct_consulta_ventas_x_cliente(data: any) {
    return this.http.get(`${this.URL}/${this.API}/ventas/${data.cliente}/${data.codigo_venta}`);
  }

  funct_actualiza_estado_ventas(cod: any, id: any) {
    return this.http.patch(`${this.URL}/${this.API}/${cod}/${id}`, {
      "estado_venta": 'CERRADO'
    })
  }

  funct_registra_pagos_s(data: any) {
    return this.http.post<any>(`${this.URL}/${this.API2}`, data);
  }

  funct_retorna_pagos_s(data: any) {
    return this.http.get(`${this.URL}/${this.API2}/${data.cliente}/${data.codigo_venta}`)
  }
}
