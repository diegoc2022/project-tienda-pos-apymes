import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VinculosService {
  private URL: string;
  private API: string;

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'vinculos';
  }

  ngOnInit(): void {

  }

  funct_registra_vinculos_s(data: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/${this.API}`, data)
  }

  funct_retorna_full_vinculos_s() {
    return this.http.get(`${this.URL}/${this.API}`);
  }

  funct_elimina_vinculos_s(data: any): Observable<any> {
    return this.http.delete(`${this.URL}/${this.API}/${data[0].codigoVinculo}`);
  }

  funct_retorna_codigo_inicial(codProducto: any): Observable<any> {
    return this.http.get(`${this.URL}/${this.API}/${codProducto}`);
  }

  funct_retorna_codigo_vinculo(codProducto: any): Observable<any> {
    return this.http.get(`${this.URL}/${this.API}/vinc/${codProducto}`);
  }

  func_activa_asociacion_unidad_s(cod: any, estado: boolean): Observable<any> {
    return this.http.patch(`${this.URL}/${this.API}/activar/${cod}`, {
      "venta_por_und": estado
    });
  }

}
