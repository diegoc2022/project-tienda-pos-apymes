import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EncabezadosServices {
  private URL?: string;
  private API?: string

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'encabezado';
  }

  funt_retorna_razon_social_encabezado() {
    return this.http.get(`${this.URL}/${this.API}`);
  }

}
