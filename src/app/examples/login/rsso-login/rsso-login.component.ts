import { ApiService } from './../../../shared/api.service';
import { Globals } from 'app/shared/globals';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rsso-login',
  templateUrl: './rsso-login.component.html',
  styleUrls: ['./rsso-login.component.css']
})
export class RssoLoginComponent implements OnInit {

  urlData: any;
  constructor(
    private cookieservice: CookieService,
    public global: Globals,
    private apiservice: ApiService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.urlData = JSON.parse(atob(this.activeRoute.snapshot.queryParamMap.get('RequestData')))

    if (this.urlData !== undefined) {
      this.rssologin(this.urlData)
    } else {
      this.router.navigate(['/home'])
    }

  }

  rssologin(data) {
    const params = {
      ownerId: data.ownerId,
      accessToken: data.accessToken
    }

    this.apiservice.rssoUserLogin(params).subscribe(userData => {
      console.log(userData);
      if (userData['responseStatus'] === 200) {
        this.cookieservice.set('token', userData['token']);
        console.log(userData['userData']);
        this.global.userInfo = userData['userData'];
        this.router.navigate(['/user-profile'])
      }
    }, (errorData) => {
      this.router.navigate(['/home'])
    });
  }

}
