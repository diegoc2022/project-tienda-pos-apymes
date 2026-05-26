import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private URL?: string;
  private API?: string;
  private API2: string;

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'inventario';
    this.API2 = 'movimientos';
  }

  funct_edita_ventas_inventario(data: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.URL}/${this.API}/editaVentaInv`, data);
  }

  funct_edita_compras_inventario(data: any[]): Observable<any> {
    return this.http.patch(`${this.URL}/${this.API}`, data);
  }

  funct_retorna_inventario() {
    return this.http.get(`${this.URL}/${this.API}`);
  }

  funct_registra_salidas_s(data: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/${this.API2}/salida`, data)
  }

  funct_registra_movimientos_s(data: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/${this.API2}/stock`, data)
  }
}
