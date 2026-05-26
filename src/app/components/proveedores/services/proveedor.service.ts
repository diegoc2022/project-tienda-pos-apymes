import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private URL?: string;
  private API?: string;

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'proveedores';
  }

  funct_retorna_proveedores() {
    return this.http.get(`${this.URL}/${this.API}`);
  }

  funct_crea_proveedores_s(data: any) {
    return this.http.post<any>(`${this.URL}/${this.API}`, {
      "nit": data.nit,
      "nombre": data.nombreProv.toUpperCase(),
      "direccion": data.dirProv.toUpperCase(),
      "telefono": data.telProv,
      "ciudad": data.ciudad.toUpperCase()
    });
  }
}
