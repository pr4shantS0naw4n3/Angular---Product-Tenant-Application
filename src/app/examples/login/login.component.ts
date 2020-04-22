import { RequestIdService } from './../../shared/request-id.service';
import { Router } from '@angular/router';
import { ApiService } from './../../shared/api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { Globals } from 'app/shared/globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  focus: any;
  focus1: any;
  hasError = false;
  error: any;
  countrys = [
    { 'countryName': 'UNITED - STATES' },
    { 'countryName': 'UNITED - KINGDOM' },
    { 'countryName': 'AUSTRALIA' },
    { 'countryName': 'CANADA' },
    { 'countryName': 'IRELAND' }
  ]
  loginForm = new FormGroup({
    country: new FormControl(''),
    emailId: new FormControl(''),
    password: new FormControl('')
  });
  constructor(
    private apiService: ApiService,
    public router: Router,
    private cookieService: CookieService,
    private requestId: RequestIdService,
    public globals: Globals
  ) { }

  ngOnInit(): void {
    const vToken = this.cookieService.get('token');
    if (vToken) {
      this.router.navigate(['/user-profile']);
    }
  }

  login() {
    const loginParams = {
      requestId: this.requestId.getRequestId(),
      emailId: this.loginForm.value.emailId,
      password: this.loginForm.value.password,
      country: this.loginForm.value.country
    }
    this.apiService.userLogin(loginParams).subscribe(userData => {
      console.log(userData);
      if (userData['responseStatus'] === 200) {
        this.hasError = false;
        this.cookieService.set('token', userData['token']);
        console.log(userData['userData']);
        this.globals.userInfo = userData['userData'];
        this.router.navigate(['/user-profile'])
      }
    }, (errorData) => {
      this.hasError = true;
      this.error = errorData.error.responseMessage
    });
  }

}
