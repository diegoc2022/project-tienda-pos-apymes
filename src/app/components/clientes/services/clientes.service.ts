import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private URL: string;
  private API: string;
  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint
    this.API = 'clientes';
  }

  funct_retorna_clientes_s() {
    return this.http.get(`${this.URL}/${this.API}`);
  }

  funct_registra_clientes_s(data: any[]) {
    return this.http.post(`${this.URL}/${this.API}`, data);
  }

  funct_retorna_one_cliente(data: any) {
    return this.http.get(`${this.URL}/${this.API}/${data}`);
  }

  funct_edita_codigo_venta_s(data: any) {
    return this.http.patch(`${this.URL}/${this.API}`, {
      "codigo_cliente": data
    })
  }

}
