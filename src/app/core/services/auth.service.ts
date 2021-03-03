import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SaveLocalService } from './save-local.service';

import { Users, Response, Login, LoginResponse } from '../interfaces';
import { environment } from '../../../environments/environment';
import { UsersInfoResponse } from '../interfaces/UsersInfo';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.BASE_URL;
  private credentials = btoa(
    `${environment.TOKEN_USERNAME}:${environment.TOKEN_PASSWORD}`
  );
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${this.credentials}`,
  });

  constructor(private http: HttpClient, private saveLocal: SaveLocalService) {}

  newUser(user: Users): Observable<Response> {
    return this.http.post<Response>(`${this.baseUrl}/api/usuario`, user).pipe(
      // tap((data) => {
      //   console.log(data);
      // }),
      catchError((err) => {
        console.error(err);
        return of({
          code: 400,
          message: 'Upss, algo salío mal, por favor reintenta más tarde',
          error: err,
        });
      })
    );
  }

  restorePassword(dataPassword: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/confirmation/change-password`, dataPassword)
      .pipe(
        // tap((data) => {
        //   console.log(data);
        // }),
        catchError((err) => {
          console.error(err);
          return of({
            code: 400,
            message: 'Upss, algo salío mal, por favor reintenta más tarde',
            error: err,
          });
        })
      );
  }

  login(user: Login): Observable<Response> {
    const param = new URLSearchParams();
    param.set('grant_type', environment.grant_type);
    param.set('username', user.usuCorreo);
    param.set('password', user.usuClave);

    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/login`, param.toString(), {
        headers: this.httpHeaders,
      })
      .pipe(
        // tap((data) => {
        //   console.log(data);
        // }),
        map<LoginResponse, Response>((data) => ({
          code: 200,
          message: data,
        })),
        catchError((err) => {
          console.error(err.error);
          if (err.error.error === 'invalid_grant') {
            return of({
              code: 400,
              message: 'Parece que la información enviada no es valida',
              error: err,
            });
          } else {
            return of({
              code: 500,
              message: 'algo salio mal, intenta más tarde',
              error: err,
            });
          }
        })
      );
  }

  editUserInfo(user: any, token: string) {
    return this.http
      .put(`${this.baseUrl}/api/perfil`, user, {
        headers: new HttpHeaders({
          authorization: `Bearer ${token}`,
        }),
      })
      .pipe(
        // tap((data) => {
        //   console.log(data);
        // }),
        map<any, Response>((data) => {
          console.log(data);
          return {
            code: 200,
            message: data,
          };
        }),
        catchError((err) => {
          console.error(err.error);
          if (err.message) {
            return of({
              code: 500,
              message: 'algo salio mal, intenta más tarde',
              error: err,
            });
          }
        })
      );
  }

  getUserInfo(token: string): Observable<Response> {
    return this.http
      .get<UsersInfoResponse>(`${this.baseUrl}/api/usuario`, {
        headers: new HttpHeaders({
          authorization: `Bearer ${token}`,
        }),
      })
      .pipe(
        // tap((data) => {
        //   console.log(data);
        // }),
        map<UsersInfoResponse, Response>((data) => ({
          code: 200,
          message: data,
        })),
        catchError((err) => {
          console.error(err.error);
          if (err.message) {
            return of({
              code: 500,
              message: 'algo salio mal, intenta más tarde',
              error: err,
            });
          }
        })
      );
  }

  forgotPassword(email: string) {
    return this.http.get(`${this.baseUrl}/api/usuario/recuperar/${email}`);
  }

  canRegisterEmail(email: string) {
    return this.http.get(`${this.baseUrl}/api/usuario/buscar/correo/${email}`);
  }
  canRegisterNick(nick: string) {
    return this.http.get(`${this.baseUrl}/api/usuario/buscar/nickname/${nick}`);
  }
}
