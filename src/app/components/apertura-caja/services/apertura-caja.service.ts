import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AperturaCajaService {
  private URL: string;
  private API: string;
  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint
    this.API = 'caja';
  }

  funct_apertura_caja(id: number, id_caja: number, base_caja: number) {
    return this.http.put(`${this.URL}/${this.API}/${id}`, {
      "id_caja": id_caja,
      "total_base": base_caja
    })
  }

  funct_retorna_apertura_caja(user: string) {
    return this.http.get(`${this.URL}/${this.API}/${user}`);
  }
}
