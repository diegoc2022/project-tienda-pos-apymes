import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private URL?: string;
  private API?: string;
  private API2?: string;
  private API3?: string;
  private API4?: string;
  fecha_actual: any;
  hora_actual: any;
  mes: any;
  year: any;
  date: Date = new Date();

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'compras-historico';
    this.API2 = 'editar';
    this.API3 = 'compras-facturas';
    this.API4 = 'compras';
  }

  funct_guarda_compras_historico(data: any[]): Observable<any> {
    return this.http.post<any[]>(`${this.URL}/${this.API}`, data)
  }

  funct_retorna_facturas_compras_s(data: any) {
    return this.http.get(`${this.URL}/${this.API}/${data}`);
  }

  funt_elimina_compras_factura_historico_s(data: any): Observable<any> {
    return this.http.delete<any>(`${this.URL}/${this.API}/${data}`);
  }

  funct_retorna_compras_historicos_s(fecha_inic: any, fecha_fin: any) {
    return this.http.get(`${this.URL}/${this.API}/result/${fecha_inic}/${fecha_fin}`);
  }

  funct_edita_precio_compras_s(cod: any, data: any) {
    return this.http.patch(`${this.URL}/${this.API2}/precioCompras/${cod}`, {
      "precio_compra": data
    });
  }

  funct_retorna_compras_facturas_s(factura: any) {
    return this.http.get(`${this.URL}/${this.API3}/${factura}`);
  }

  funct_registra_factura_compra(num: any) {
    return this.http.post(`${this.URL}/${this.API3}`, {
      "factura": num[0].num_factura.toUpperCase()
    })
  }

  funct_elimina_compras_facturas_s(data: any) {
    return this.http.delete<any>(`${this.URL}/${this.API3}/${data}`);
  }

  funct_retorna_compras_s() {
    return this.http.get(`${this.URL}/${this.API4}`);
  }

  funct_elimina_item_compras_s(data: any) {
    return this.http.delete(`${this.URL}/${this.API4}/item/${data}`);
  }

  funct_elimina_factura_compras_temp_s() {
    return this.http.delete(`${this.URL}/${this.API4}`);
  }

  funct_registra_compras_s(data: any, data2: any) {
    this.fecha_actual = format(this.date, 'yyyy-MM-dd');
    this.mes = format(this.date, 'M');
    this.year = format(this.date, 'yyyy');
    this.hora_actual = format(new Date(), 'HH:mm');
    return this.http.post(`${this.URL}/${this.API4}`, {
      "cod_producto": data2.codProd.toUpperCase(),
      "descripcion": data2.descrip.toUpperCase(),
      "num_factura": data.factura.toUpperCase(),
      "tipo_compra": data.varios,
      "precio_unitario": data2.precio_und,
      "cantidad": data2.cantidad,
      "subtotal": data2.costo_sin_iva,
      "descuento": data2.desc,
      "total_descuento": data2.total_desc,
      "iva": data2.iva,
      "total_iva": data2.totaliva,
      "icui": data2.icui,
      "total_icui": data2.totalicui,
      "total_compras": data2.total_costo,
      "costo_unidad": data2.costo_und,
      "utilidad": data2.utilidad,
      "precio_venta": data2.precioVenta,
      "num_mes": this.mes,
      "num_year": this.year,
      "fecha_registro": this.fecha_actual,
      "hora_registro": this.hora_actual
    })
  }

}
