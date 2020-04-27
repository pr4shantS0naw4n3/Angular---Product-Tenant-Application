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
      "price": 7
    },
    {
      "id": 'b',
      "download_url": "https://picsum.photos/id/1/5616/3744",
      "isSelected": false,
      "width": 2500,
      "height": 1667,
      "price": 2
    },
    {
      "id": 'c',
      "download_url": "https://picsum.photos/id/10/2500/1667",
      "isSelected": false,
      "width": 5626,
      "height": 3635,
      "price": 2
    },
    {
      "id": 'd',
      "download_url": "https://picsum.photos/id/100/2500/1656",
      "isSelected": false,
      "width": 1080,
      "height": 900,
      "price": 4
    },
    {
      "id": 'e',
      "download_url": "https://picsum.photos/id/1000/5626/3635",
      "isSelected": false,
      "width": 1756,
      "height": 890,
      "price": 9
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
      "amountToPay": this.amountToPay
    }
    this.dialogRef.close()
    this.globals.paymentData = packInfo
    this.router.navigate(['/user/make-payment'])

  }

  cancel() {
    this.dialogRef.close()
  }

}
