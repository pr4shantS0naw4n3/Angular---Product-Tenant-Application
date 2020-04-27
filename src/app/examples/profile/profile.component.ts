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
    constructor(
        public globals: Globals,
        public dialog: MatDialog,
        private cookieService: CookieService,
        private router: Router,
        private apiservice: ApiService
    ) { }

    ngOnInit() {
        const vToken = this.cookieService.get('token');
        if (vToken) {
            this.user_info = this.globals.userInfo;
            this.user_fullName = this.user_info.fullname
            this.user_emailId = this.user_info.emailId
            this.user_country = this.user_info.country
            this.user_mobileNo = this.user_info.mobileNo
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
            this.transaction_info = Array(data['userDetails'])
            console.log(this.transaction_info);

        })
    }

}