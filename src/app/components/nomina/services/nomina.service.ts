import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NominaService {
  private URL: string;
  private API: string;
  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint
    this.API = 'nomina';
  }

  funct_registra_nomina_s(data: any) {
    return this.http.post(`${this.URL}/${this.API}`, data);
  }

  funt_retorna_pagos_nomina_s(cedula: any, num_mes: any, num_year: any) {
    return this.http.get(`${this.URL}/${this.API}/${cedula}/${num_mes}/${num_year}`);
  }

  funt_retorna_nomina_empleado_s(num_mes: any, num_year: any) {
    return this.http.get(`${this.URL}/${this.API}/${num_mes}/${num_year}`);
  }
}
