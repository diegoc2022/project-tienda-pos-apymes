import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  private URL?: string;
  private API?: string;

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'empleados';
  }

  funct_retorna_empleados_s() {
    return this.http.get(`${this.URL}/${this.API}`);
  }

  funct_retorna_one_empleados_s(ced: any) {
    return this.http.get(`${this.URL}/${this.API}/empleado/${ced}`);
  }

  funct_registra_emeplados_s(data: any) {
    return this.http.post<any>(`${this.URL}/${this.API}`, {
      "cedula": data.cedula,
      "nombre_empleado": data.nombre.toUpperCase(),
      "usuario": data.usuario.toLowerCase(),
      "direccion": data.dirEmp.toUpperCase(),
      "telefono": data.telEmp,
      "ciudad": data.ciudad.toUpperCase()
    });
  }
}
