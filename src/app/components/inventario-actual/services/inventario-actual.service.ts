import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventarioActualService {
  private URL?: string;
  private API?: string;

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'inventario-actual';
  }

  funct_edita_inventario_actual(data: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.URL}/${this.API}`, data);
  }

  funct_retorna_inventario_actual() {
    return this.http.get(`${this.URL}/${this.API}`);
  }

  funct_retorna_inventario_x_id(id: number, id_tipo: any) {
    return this.http.get(`${this.URL}/${this.API}`);
  }

  funct_registra_inventario_actual_s(data: any[]): Observable<any> {
    return this.http.post<any>(`${this.URL}/${this.API}`, data)
  }

  funct_elima_inventario_actual_s() {
    return this.http.delete(`${this.URL}/${this.API}`);
  }

}
