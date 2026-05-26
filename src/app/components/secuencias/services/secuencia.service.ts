import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SecuenciaService {
  private URL?: string;
  private API?: string;

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'secuencia';
  }

  funct_retorna_factura_s(): Observable<string> {
    return this.http.get<string>(`${this.URL}/${this.API}`);
  }

  funct_genera_factura_s(data: any[]): Observable<any[]> {
    return this.http.put<any[]>(`${this.URL}/${this.API}`, data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
