import { AesUtilService } from './../../../shared/aes-util.service';
import { Router } from '@angular/router';
import { NotificationService } from './../../../shared/notification.service';
import { ApiService } from './../../../shared/api.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Globals } from 'app/shared/globals';

@Component({
  selector: 'app-buy-image-dialog',
  templateUrl: './buy-image-dialog.component.html',
  styleUrls: ['./buy-image-dialog.component.css']
})
export class BuyImageDialogComponent implements OnInit {

  imageCount = 0;
  error = false;
  errorMessage: any;
  preConfirm = false;
  filterSelectedImage: any;
  amountToPay = 0;
  imageArray = [
    {
      "id": 'a',
      "download_url": "https://picsum.photos/id/1015/6000/4000",
      "isSelected": false,
      "width": 5616,
      "height": 3744,
      "price": 200
    },
    {
      "id": 'b',
      "download_url": "https://picsum.photos/id/1/5616/3744",
      "isSelected": false,
      "width": 2500,
      "height": 1667,
      "price": 1000
    },
    {
      "id": 'c',
      "download_url": "https://picsum.photos/id/10/2500/1667",
      "isSelected": false,
      "width": 5626,
      "height": 3635,
      "price": 100
    },
    {
      "id": 'd',
      "download_url": "https://picsum.photos/id/100/2500/1656",
      "isSelected": false,
      "width": 1080,
      "height": 900,
      "price": 80
    },
    {
      "id": 'e',
      "download_url": "https://picsum.photos/id/1000/5626/3635",
      "isSelected": false,
      "width": 1756,
      "height": 890,
      "price": 6
    },
    {
      "id": 'f',
      "download_url": "https://picsum.photos/id/1001/5616/3744",
      "isSelected": false,
      "width": 5626,
      "height": 3635,
      "price": 5
    },
    {
      "id": 'g', "download_url": "https://picsum.photos/id/1002/4312/2868",
      "isSelected": false,
      "width": 5626,
      "height": 3635,
      "price": 6
    },
    {
      "id": 'h',
      "download_url": "https://picsum.photos/id/1004/5616/3744",
      "isSelected": false,
      "width": 5626,
      "height": 3635,
      "price": 8
    }
  ];
  constructor(
    public dialogRef: MatDialogRef<BuyImageDialogComponent>,
    private apiService: ApiService,
    private notify: NotificationService,
    private router: Router,
    public globals: Globals,
    private aesUtilService: AesUtilService,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) { }

  ngOnInit(): void {
    console.log(this.userData);
  }

  confirm() {
    console.log(this.imageArray);
    this.filterSelectedImage = this.imageArray.filter(data => {
      if (data['isSelected'] === true) {
        this.amountToPay = this.amountToPay + data['price']
        return data;
      }
    })
    console.log(this.filterSelectedImage)
    if (this.filterSelectedImage.length > 0) {
      this.preConfirm = true;
    } else {
      this.preConfirm = false;
      this.notify.pop("Please Select atleast 1 image to proceed further.")
    }
  }

  pay() {
    const packInfo = {
      "customerName": this.userData.userInfo.fullname,
      "emailId": this.userData.userInfo.emailId,
      "contactNo": this.userData.userInfo.mobileNo,
      "imageQuantity": this.filterSelectedImage.length,
      "amountToPay": this.amountToPay,
      "discountedAmount": 0
    }
    if (this.userData.userInfo.isPrime) {
      if (this.amountToPay <= this.userData.totalTransactionAmount) {
        this.dialogRef.close()
        this.globals.paymentData = packInfo
        this.doPrimeTransaction()
      } else {
        const ans = confirm('You have exceeded your free transaction amount benefit, Do you like to pay the remaining amount using our usual payment method?')
        if (ans) {
          packInfo['amountToPay'] = this.amountToPay - this.userData.totalTransactionAmount
          packInfo['discountedAmount'] = this.userData.totalTransactionAmount
          this.globals.paymentData = packInfo
          this.dialogRef.close()
          this.router.navigate(['/user/make-payment'])
        }
      }
    } else {
      this.globals.paymentData = packInfo
      this.dialogRef.close()
      this.router.navigate(['/user/make-payment'])
    }
  }

  doPrimeTransaction() {
    const userData = this.globals.paymentData
    const params = {
      requestType: "buyImages",
      emailId: userData.emailId,
      imageCount: userData.imageQuantity,
      transactionAmount: userData.amountToPay
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
            "txnAmount": userData.amountToPay,
            "txnType": "booking",
            "updatedUtilizationInfo": true
          }
        }
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

  cancel() {
    this.dialogRef.close()
  }

}
