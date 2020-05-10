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

    discountCouponInfo: any;
    planBenefitsInfo: any;
    planPaymentInfo: any;
    planUtilizationInfo: any;
    userSubscriptionPlans: any;

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
            'userInfo': this.user_info,
            'noOfTransactionsRemaining': this.globals.userInfo.isPrime ? this.planUtilizationInfo.remainingVelocity : 0,
            'totalTransactionAmount': this.globals.userInfo.isPrime ? this.planUtilizationInfo.remainingVolume : 0
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
            this.transaction_info = data['userDetails']
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
            const parsedData = JSON.parse(data.toString());
            const userPlanData = this.aesutilService.internalDecrypt(parsedData['response'])
            const parsedUserData = JSON.parse(userPlanData)
            if (parsedUserData.responseMessage === "Success") {
                this.user_info['isPrime'] = true;
                this.globals.userInfo = this.user_info;
                console.log(parsedUserData);
                this.discountCouponInfo = parsedUserData.userSubscriptionPlanDetails.discountCouponInfo
                this.planBenefitsInfo = parsedUserData.userSubscriptionPlanDetails.planBenefitsInfo
                this.planPaymentInfo = parsedUserData.userSubscriptionPlanDetails.planPaymentInfo
                this.planUtilizationInfo = parsedUserData.userSubscriptionPlanDetails.planUtilizationInfo;
                this.userSubscriptionPlans = parsedUserData.userSubscriptionPlanDetails.userSubscriptionPlan.subscriptionPlanInfo
                this.globals.userPlanData = this.userSubscriptionPlans
                console.log(this.userSubscriptionPlans);
                if (this.planUtilizationInfo.remainingVelocity === 0 || this.planUtilizationInfo.remainingVolume === 0) {
                    this.user_info['isPrime'] = false;
                    this.globals.userInfo = this.user_info;
                }

            } else {
                this.user_info['isPrime'] = false;
                this.globals.userInfo = this.user_info;
                console.log(parsedUserData);
            }
        }, (error) => {
            console.log(error);
            this.user_info['isPrime'] = false;
            this.globals.userInfo = this.user_info;
        })
    }

    tryPrime() {
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

            this.apiservice.getChecksum(csparams).subscribe(data => {
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
                this.apiservice.encrypt(params).subscribe(data => {
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
                    this.apiservice.ssoApi(ssoAPIParams).subscribe(data => {
                        const responseData = JSON.parse(data.toString());
                        console.log(responseData);
                        this.apiservice.decrypt(responseData.response).subscribe(data => {
                            console.log(data);
                            const ssoAPIResponse = JSON.parse(data.toString());
                            const accessUrl = ssoAPIResponse.accessURL
                            this.apiservice.decrypt(ssoAPIResponse.accessToken).subscribe(data => {
                                console.log(data);
                                const splitData = data.toString().split('|')
                                // const redirectURL = accessUrl + '&token=' + ssoAPIResponse['accessToken'] + '&ownerId=' + splitData[1]
                                const urlData = {
                                    url: accessUrl.toString().split('?')[0],
                                    to: accessUrl.toString().split('?')[1].split('=')[1],
                                    token: ssoAPIResponse['accessToken'],
                                    ownerId: splitData[1]
                                }
                                this.apiservice.redirect(urlData)
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