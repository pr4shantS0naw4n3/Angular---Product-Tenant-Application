import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private cookieService: CookieService,
    private http: HttpClient
  ) { }

  userLogin(userData) {
    return this.http.post(environment.api + 'user/Login/', JSON.stringify(userData), httpOptions);
  }

  registerNewUser(userData) {
    return this.http.post(environment.api + 'users/', JSON.stringify(userData), httpOptions);
  }

  buyImage(data) {
    return this.http.post(environment.api + 'user/buyImages/', JSON.stringify(data), httpOptions);
  }
}
