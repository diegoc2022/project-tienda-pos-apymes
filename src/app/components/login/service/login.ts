import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Environment from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private URL?: string;
  private API?: string

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'auth/login';
  }

  funct_retorna_usuario_s(user: any, passw: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/${this.API}`, {
      "user": user,
      "clave": passw
    },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
  }

}
