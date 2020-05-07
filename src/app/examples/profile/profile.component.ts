import { AesUtilService } from './../../shared/aes-util.service';
import { ApiService } from './../../shared/api.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BuyImageDialogComponent } from './buy-image-dialog/buy-image-dialog.component';
import { Component, OnInit, Inject } from '@angular/core';
import { Globals } from 'app/shared/globals';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    user_info: any;
    user_fullName: any;
    user_emailId: any;
    user_country: any;
    user_mobileNo: any;
    transaction_info: any;
    showTransactionTab = false;
    constructor(
        public globals: Globals,
        public dialog: MatDialog,
        private cookieService: CookieService,
        private router: Router,
        private apiservice: ApiService,
        private aesutilService: AesUtilService
    ) { }

    ngOnInit() {
        const vToken = this.cookieService.get('token');
        if (vToken) {
            this.user_info = this.globals.userInfo;
            this.user_fullName = this.user_info.fullname
            this.user_emailId = this.user_info.emailId
            this.user_country = this.user_info.country
            this.user_mobileNo = this.user_info.mobileNo
            this.getUserPlan();
            this.getTransactionHistory(this.user_emailId)
        } else {
            this.router.navigate(['/login']);
        }
    }

    userBuyImage() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '100%';
        dialogConfig.height = '100%';
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.data = {
            'userInfo': this.user_info
        }

        const dialogRef = this.dialog.open(BuyImageDialogComponent, dialogConfig);
    }

    getTransactionHistory(emailId) {
        const params = {
            "requestType": "getTransactionHistory",
            "emailId": emailId
        }
        this.apiservice.getTransactionHistory(params).subscribe(data => {
            this.showTransactionTab = true;
            this.transaction_info = Array(data['userDetails'])
            console.log(this.transaction_info);
        }, (errorData) => {
            this.showTransactionTab = false;
        })
    }

    getUserPlan() {
        const params = {
            "requestId": "3980908",
            "channelId": "WEBSITE",
            "ipAddress": "10.158.212.22",
            "organizationId": "34576",
            "requestName": "getPartnerUserPlan",
            "productId": "1",
            "productUser": "toml",
            "productPassword": "Test@1234",
            "userSubscriptionPlanInfo": {
                "customerId": this.user_info.ownerId,
                "customerIdType": "int",
                "subscriptionStatus": "ACTIVE",
                "planUtilization": "Y",
                "paymentInfo": "Y",
                "discountInfo": "Y"
            }
        }

        const enc = this.aesutilService.internalEncrypt(JSON.stringify(params));
        const encParams = {
            request: enc
        }

        this.apiservice.getuserPlan(encParams).subscribe(data => {
            console.log(data);
        }, (error) => {
            console.log(this.aesutilService.internalDecrypt("rn79jULPDgFzCqGYQSZ+6hWDHC32qL0oGCe/eNAzGZ8teo1PZgfquouOir3IktzjN8z3/fQTycwyF1NbnZXpc7TdhFLrWXI5D6w3lgdb1IZFtBOt1dIEyoKCJzDHqi2VeZAdKlnQgXvp84aLv95s8nNENMeR6TBDuiwv+cUgKNrjgMLogCVwu8QlP96GMkInwj6KznyScuB6J05k+KLB/O5zIHnGPNVHnJcPuQDg8sKRVz8I9U1cHB1XdlMu0EAMM1RxzgvFQFUQ/rZ0TschyXFdhoX/ZMgOJQzmiAqGpkI="));
        })
    }

}