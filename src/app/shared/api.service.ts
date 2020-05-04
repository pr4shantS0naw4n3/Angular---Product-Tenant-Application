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
    return this.http.post(environment.apiUserEc2 + 'login/', JSON.stringify(userData), httpOptions);
  }

  rssoUserLogin(userData) {
    return this.http.post(environment.apiSSOEc2 + 'login/', JSON.stringify(userData), httpOptions);
  }

  registerNewUser(userData) {
    return this.http.post(environment.apiUserEc2 + 'register/', JSON.stringify(userData), httpOptions);
  }

  buyImage(data) {
    return this.http.post(environment.apiUserEc2 + 'buyImages/', JSON.stringify(data), httpOptions);
  }

  getTransactionHistory(data) {
    return this.http.post(environment.apiUserEc2 + 'getTransactionHistory/', JSON.stringify(data), httpOptions);
  }
}
