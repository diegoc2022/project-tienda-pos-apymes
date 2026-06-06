import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AperturaInventarioService {
  private URL?: string;
  private API?: string;

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'apertura-inventario'
  }

  funct_genera_id_inventario(id: number, id_inv: number) {
    return this.http.put(`${this.URL}/${this.API}/${id}`, {
      "id_inventario": id_inv
    })
  }

  funct_retorna_id_inventario() {
    return this.http.get(`${this.URL}/${this.API}`);
  }

}
