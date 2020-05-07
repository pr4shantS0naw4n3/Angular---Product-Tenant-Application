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
    return this.http.post(environment.apiUserEc2 + 'login/', JSON.stringify(userData), httpOptions);
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

  rssoUserLogin(userData) {
    return this.http.post(environment.apiSSOEc2 + 'login/', JSON.stringify(userData), httpOptions);
  }

  getChecksum(data) {
    return this.http.post(environment.apiSSOEc2 + 'getChecksum/', JSON.stringify(data), httpOptions);
  }

  ssoApi(data) {
    return this.http.post('http://52.51.49.231:8080/api/usermanagement/SSOSpec/SSOAPI', JSON.stringify(data), httpJSONOptions)
  }

  encrypt(data) {
    return this.http.post('http://52.51.49.231:8080/api/usermanagement/SSOSpec/ssoEncrypt', JSON.stringify(data), httpJSONOptions)
  }

  decrypt(data) {
    return this.http.post('http://52.51.49.231:8080/api/usermanagement/SSOSpec/ssoDecrypt', JSON.stringify(data), httpJSONOptions)
  }

  redirect(urlData) {
    console.log(urlData);
    const form = document.createElement('form');
    form.style.display = 'none';
    form.method = 'POST';
    form.action = urlData.url;
    let input1, input2, input3;

    const signForm = new FormGroup({
      'url': new FormControl(urlData.to),
      'token': new FormControl(urlData.token),
      'ownerId': new FormControl(urlData.ownerId)
    });

    input1 = document.createElement('input');
    input1.name = 'token';
    input1.id = 'token';
    input1.value = signForm.value.token;
    input2 = document.createElement('input');
    input2.name = 'ownerId';
    input2.id = 'ownerId';
    input2.value = signForm.value.ownerId;
    input3 = document.createElement('input');
    input3.name = 'url';
    input3.id = 'url';
    input3.value = signForm.value.url;
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);

    document.body.appendChild(form);
    console.log(form);
    this.cookieService.delete('token')
    // form.submit();
  }

  getuserPlan(params) {
    return this.http.post('http://52.51.49.231:8081/api/subscriptionmanagement/userSubscriptionPlan/getPartnerUserPlan', JSON.stringify(params), httpJSONOptions)
  }
}
