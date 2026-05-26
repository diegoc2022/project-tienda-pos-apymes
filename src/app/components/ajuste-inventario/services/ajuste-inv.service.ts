import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AjusteInvService {
  private URL?: string;
  private API?: string;

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'editar';
  }

  funct_ajusta_inventario_s(cod: any, data: any) {
    let cant = parseInt(data);
    return this.http.patch(`${this.URL}/${this.API}/cantidad/${cod}`, {
      "existencia": cant
    });
  }
}
