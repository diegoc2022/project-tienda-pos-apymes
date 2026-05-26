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
    return this.http.post<any>(`${this.URL}/${this.API}`, {
      "codigoInicial": data.codigoInic.toUpperCase(),
      "codigoVinculo": data.codigoVinc.toUpperCase()
    })
  }

  funct_retorna_full_vinculos_s() {
    return this.http.get(`${this.URL}/${this.API}`);
  }

  funct_retorna_vinculos(id: any) {
    return this.http.get(`${this.URL}/${this.API}/${id}`);
  }

  funct_elimina_vinculos_s(data: any): Observable<any> {
    return this.http.delete(`${this.URL}/${this.API}/${data[0].codigoInicial}/${data[0].codigoVinculo}`);
  }

  funct_retorna_vinculo_productos(codProducto: any): Observable<any> {
    return this.http.get(`${this.URL}/${this.API}/${codProducto}`);
  }

  func_activa_asociacion_unidad_s(cod: any, estado: boolean): Observable<any> {
    return this.http.patch(`${this.URL}/${this.API}/activar/${cod}`, {
      "venta_por_und": estado
    });
  }

}
