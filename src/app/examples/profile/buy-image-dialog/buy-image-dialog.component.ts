import { NotificationService } from './../../../shared/notification.service';
import { ApiService } from './../../../shared/api.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-buy-image-dialog',
  templateUrl: './buy-image-dialog.component.html',
  styleUrls: ['./buy-image-dialog.component.css']
})
export class BuyImageDialogComponent implements OnInit {

  imageCount = 0;
  error = false;
  errorMessage: any;
  constructor(
    public dialogRef: MatDialogRef<BuyImageDialogComponent>,
    private apiService: ApiService,
    private notify: NotificationService,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) { }

  ngOnInit(): void {
    console.log(this.userData);
  }

  buy() {
    console.log(this.imageCount);
    if (this.imageCount > 0) {
      this.error = false;
      const params = {
        emailId: this.userData.userInfo.emailId,
        imageCount: this.imageCount,
      }
      this.apiService.buyImage(params).subscribe(data => {
        console.log(data);
        if (data['responseStatus'] === 200) {
          this.notify.pop(data['responseMessage'])
          this.dialogRef.close()
        }
      }, (errorData) => {
        this.notify.pop(errorData.error.responseMessage)
        this.dialogRef.close()
      })
    } else {
      this.error = true;
      this.errorMessage = 'Please select the number of images you want to Buy';
    }
  }
  cancel() {
    this.dialogRef.close()
  }

}
