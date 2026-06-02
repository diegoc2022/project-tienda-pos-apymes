import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private URL?: string;
  private API?: string
  private API2?: string

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'venta-producto';
    this.API2 = 'editar';
  }

  funct_retorna_full_productos(): Observable<any> {
    return this.http.get(`${this.URL}/${this.API}`)
  }

  funct_elimina_productos_s(data: any): Observable<any> {
    return this.http.delete(`${this.URL}/${this.API}/${data}`)
  }

  funct_crea_productos(products: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/${this.API}`, {
      "codProd": products.codProd.toUpperCase(),
      "descripcion": products.nombre.toUpperCase(),
      "precio_compra": 0,
      "precio_venta": 0,
      "existencia": 0,
      "codigo_clasific": 0,
      "codigo_proveed": products.codProv,
      "iva": 0,
      "icui": 0,
      "utilidad": 0,
      "venta_por_und": false
    });
  }

  funct_edita_productos_s(data: any) {
    return this.http.patch(`${this.URL}/${this.API2}/codigo/${data.codInicial}`, {
      "codProd": data.codNuevo.toUpperCase(),
      "descripcion": data.nombreProd.toUpperCase()
    });
  }

}
