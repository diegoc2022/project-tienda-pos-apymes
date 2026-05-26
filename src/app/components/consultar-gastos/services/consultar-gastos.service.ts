import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConsultarGastosService {
  private URL: string;
  private API: string;
  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint
    this.API = 'gastos';
  }

  funt_retorna_gastos_operativos_s(num_mes: any, num_year: any) {
    return this.http.get(`${this.URL}/${this.API}/${num_mes}/${num_year}`);
  }
}
