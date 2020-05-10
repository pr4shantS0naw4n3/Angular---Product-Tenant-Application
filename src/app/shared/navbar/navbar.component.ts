import { ApiService } from './../api.service';
import { Globals } from 'app/shared/globals';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;

    constructor(
        public location: Location,
        private element: ElementRef,
        private cookieService: CookieService,
        private apiServie: ApiService,
        private router: Router,
        public globals: Globals) {
        this.sidebarVisible = false;
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');

        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/home') {
            return true;
        }
        else {
            return false;
        }
    }
    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/documentation') {
            return true;
        }
        else {
            return false;
        }
    }

    isProfile() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/user-profile') {
            return true;
        }
        else {
            return false;
        }
    }

    logout() {
        this.cookieService.delete('token');
        localStorage.removeItem('userInfo')
        localStorage.removeItem('userPlanInfo')
        this.router.navigate(['/login']);
    }
    isPayment() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee.includes('/make-payment')) {
            return false;
        }
        else {
            return true;
        }
    }

    isPrime() {
        if (this.globals.userInfo !== null && this.globals.userInfo.isPrime) {
            return 'Prime'
        } else {
            return 'Try Prime'
        }
    }

    changeStyle(e) {
        console.log(e);
    }

    doSSO() {
        const userData = this.globals.userInfo;
        if (this.cookieService.get('token')) {
            //Step 0 Generate Checksum
            let checksum;
            let urlTo;
            let activityCode = Math.floor(100000 + Math.random() * 90000000000000)
            let sourceSessionId = Math.floor(100000 + Math.random() * 900000000)
            const csparams = {
                "requestName": "SSOAPI",
                "sourceUserName": "toml",
                "sourcePassword": "Test@1234",
                "sourceSessionId": sourceSessionId.toString(),
                "ownerId": userData.ownerId.toString(),
                "activityCode": activityCode.toString()
            }
            console.log(csparams);

            this.apiServie.getChecksum(csparams).subscribe(data => {
                checksum = data['checksum'];
                urlTo = userData.isPrime ? 'dashboard' : 'subscribe'
                //Step 1 Create Request
                const params = {
                    "requestName": "SSOAPI",
                    "sourceUserName": "toml",
                    "sourcePassword": "Test@1234",
                    "sourceSessionId": sourceSessionId,
                    "ownerId": userData.ownerId,
                    "activityCode": activityCode,
                    "activityUrl": "http://18northdev.com/test_prod/ng.php?url=" + urlTo,
                    "checksum": checksum,
                    "firstName": userData.firstName,
                    "lastName": userData.lastName,
                    "emailId": userData.emailId,
                    "mobileNo": userData.mobileNo,
                    "country": userData.country
                }
                console.log(params);
                // Step 2 Encrypt it 
                this.apiServie.encrypt(params).subscribe(data => {
                    const encryptedRequest = data
                    const ssoAPIParams = {
                        "sourceId": "TRPRIME",
                        "request": encryptedRequest,
                        "encryptionMode": "2",
                        "partnerID": "TOML",
                        "channelId": "WEBSITE"
                    }
                    console.log(ssoAPIParams);
                    //Step 3 Send it to SSO API
                    this.apiServie.ssoApi(ssoAPIParams).subscribe(data => {
                        const responseData = JSON.parse(data.toString());
                        console.log(responseData);
                        this.apiServie.decrypt(responseData.response).subscribe(data => {
                            console.log(data);
                            const ssoAPIResponse = JSON.parse(data.toString());
                            const accessUrl = ssoAPIResponse.accessURL
                            this.apiServie.decrypt(ssoAPIResponse.accessToken).subscribe(data => {
                                console.log(data);
                                const splitData = data.toString().split('|')
                                const urlData = {
                                    url: accessUrl.toString().split('?')[0],
                                    to: accessUrl.toString().split('?')[1].split('=')[1],
                                    token: ssoAPIResponse['accessToken'],
                                    ownerId: splitData[1]
                                }
                                this.apiServie.redirect(urlData)
                                // const gotoUrl = "http://localhost:1111/#/" + urlData.to + "?redirectToUrl=" + urlData.to + "&token=" + urlData.token + "&ownerId=" + urlData.ownerId;
                            })

                            // Step 4 Get the response and redirect
                        })
                    }, (error) => {
                        console.log(error);
                    })
                }, (error) => {
                    console.log(error);
                })
            }, (error) => {
                console.log(error);
            })
        } else {
            window.location.href = 'http://18northdev.com/#/registration';
        }
    }
}
