import { FormGroup, FormControl } from '@angular/forms';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  })
};

const httpJSONOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'text' as 'json'
};
httpJSONOptions.headers.append('Access-Control-Allow-Origin', '*');
httpJSONOptions.headers.append('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS');
httpJSONOptions.headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private cookieService: CookieService,
    private http: HttpClient
  ) { }

  userLogin(userData) {
    return this.http.post(environment.apiUserLcl + 'login/', JSON.stringify(userData), httpOptions);
  }

  registerNewUser(userData) {
    return this.http.post(environment.apiUserLcl + 'register/', JSON.stringify(userData), httpOptions);
  }

  buyImage(data) {
    return this.http.post(environment.apiUserLcl + 'buyImages/', JSON.stringify(data), httpOptions);
  }

  getTransactionHistory(data) {
    return this.http.post(environment.apiUserLcl + 'getTransactionHistory/', JSON.stringify(data), httpOptions);
  }

  rssoUserLogin(userData) {
    return this.http.post(environment.apiSSOLcl + 'login/', JSON.stringify(userData), httpOptions);
  }

  getChecksum(data) {
    return this.http.post(environment.apiSSOLcl + 'getChecksum/', JSON.stringify(data), httpOptions);
  }

  ssoApi(data) {
    return this.http.post('http://52.209.177.169:8080/api/usermanagement/SSOSpec/SSOAPI', JSON.stringify(data), httpJSONOptions)
  }

  encrypt(data) {
    return this.http.post('http://52.209.177.169:8080/api/usermanagement/SSOSpec/ssoEncrypt', JSON.stringify(data), httpJSONOptions)
  }

  decrypt(data) {
    return this.http.post('http://52.209.177.169:8080/api/usermanagement/SSOSpec/ssoDecrypt', JSON.stringify(data), httpJSONOptions)
  }

  redirect(urlData) {
    console.log(urlData);
    const form = document.createElement('form');
    form.style.display = 'none';
    form.method = 'POST';
    form.action = urlData.url + "?url=" + urlData.to;
    let input;

    const signForm = new FormGroup({
      'token': new FormControl(urlData.token),
      'ownerId': new FormControl(urlData.ownerId)
    });

    for (const [key, value] of Object.entries(signForm.value)) {
      input = document.createElement('input');
      input.name = key;
      input.id = key;
      input.value = value;
      form.appendChild(input);
    }
    console.log(form);

    document.body.appendChild(form);

    form.submit();
  }

  getuserPlan(params) {
    return this.http.post('http://52.209.177.169:8081/userSubscriptionPlan/getPartnerUserPlan', JSON.stringify(params), httpJSONOptions)
  }
}
