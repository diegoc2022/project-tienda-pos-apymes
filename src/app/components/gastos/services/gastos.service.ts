import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GastosService {
  private URL: string;
  private API: string;
  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint
    this.API = 'gastos';
  }

  funct_registra_gastos_operativos_s(data: any) {
    return this.http.post(`${this.URL}/${this.API}`, data);
  }

}
