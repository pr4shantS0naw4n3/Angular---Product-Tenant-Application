import { AesUtilService } from './../shared/aes-util.service';
import { ApiService } from './../shared/api.service';
import { NotificationService } from './../shared/notification.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from 'app/shared/globals';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  userData: any;
  paymentFormGroup = new FormGroup({
    nameOnCard: new FormControl(''),
    cardNumber: new FormControl(''),
    expiryDate: new FormControl(''),
    cvv: new FormControl('')
  });
  constructor(
    private globals: Globals,
    private notify: NotificationService,
    private router: Router,
    private apiService: ApiService,
    private aesUtilService: AesUtilService
  ) { }

  ngOnInit() {
    if (this.globals.paymentData) {
      this.userData = this.globals.paymentData
    } else {
      this.router.navigate(['/user-profile']);
    }
  }

  formatCardNumber(e) {
    const val = e.target.value
    if (val.length == 4 || val.length == 11 || val.length == 18) {
      this.paymentFormGroup.controls['cardNumber'].setValue(this.paymentFormGroup.value.cardNumber + ' - ')
    }
  }

  formatExpDate(e) {
    const val = e.target.value
    if (val.length == 2) {
      this.paymentFormGroup.controls['expiryDate'].setValue(this.paymentFormGroup.value.expiryDate + ' / ')
    }
  }

  checkDetails() {
    let validFlag = false;
    this.paymentFormGroup.value.cardNumber === '9999 - 9999 - 9999 - 9999' ? validFlag = true : validFlag = false
    this.paymentFormGroup.value.expiryDate === '10/2021' ? validFlag = true : validFlag = false
    this.paymentFormGroup.value.cvv === '111' ? validFlag = true : validFlag = false
    if (validFlag) {
      this.proceedToPay()
    }
    else {
      this.notify.pop('Invalid payment details, Please enter correct deatils and try again')
    }

  }

  proceedToPay() {
    console.log(this.userData);

    const params = {
      requestType: "buyImages",
      emailId: this.userData.emailId,
      imageCount: this.userData.imageQuantity,
      transactionAmount: this.userData.amountToPay
    }
    this.apiService.buyImage(params).subscribe(data => {
      if (data['responseStatus'] === 200 && this.globals.userInfo.isPrime) {
        const utilizationParams = {
          "requestId": "3980908",
          "channelId": "WEBSITE",
          "ipAddress": "10.158.212.22",
          "requestName": "updatePartnerUserPlanUtilization",
          "organizationId": "34576",
          "productId": "1",
          "productUser": "toml",
          "productPassword": "Test@1234",
          "updatePartnerUserPlanUtilization": {
            "customerId": this.globals.userInfo.ownerId,
            "subscriptionPlanId": this.globals.userPlanData.subscriptionPlanId,
            "partnerTxnRefNumber": "1213044001",
            "fromCountryCode": this.globals.userPlanData.fromCountryCode,
            "fromCurrencyCode": this.globals.userPlanData.fromCurrencyCode,
            "toCountryCode": this.globals.userPlanData.toCountryCode,
            "toCurrencyCode": this.globals.userPlanData.toCurrencyCode,
            "txnAmount": this.userData.discountedAmount === 0 ? this.userData.amountToPay : this.userData.discountedAmount,
            "txnType": "booking",
            "updatedUtilizationInfo": true
          }
        }
        console.log(utilizationParams);

        const encParams = this.aesUtilService.internalEncrypt(JSON.stringify(utilizationParams))
        this.apiService.updateUserPlanUtilization(encParams).subscribe(response => {
          const parsedData = JSON.parse(response.toString());
          const planUtilizationData = this.aesUtilService.internalDecrypt(parsedData['response'])
          const parsedUtilizationData = JSON.parse(planUtilizationData)
          console.log(parsedUtilizationData);
          this.notify.pop(data['responseMessage'])
          localStorage.removeItem('paymentInfo');
          this.router.navigate(['/user/make-payment/payment-success'])
        }, (error) => {
          this.notify.pop("There some Internal problem going on, please try again later")
          this.router.navigate(['/user-profile'])
        })
      } else {
        this.notify.pop(data['responseMessage'])
        localStorage.removeItem('paymentInfo');
        this.router.navigate(['/user/make-payment/payment-success'])
      }
    }, (errorData) => {
      this.notify.pop(errorData.error.responseMessage)
    })
  }

}
