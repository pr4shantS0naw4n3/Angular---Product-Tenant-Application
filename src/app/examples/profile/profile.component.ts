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
    constructor(
        public globals: Globals,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.user_info = this.globals.userInfo;
        this.user_fullName = this.user_info.fullname
        this.user_emailId = this.user_info.emailId
        this.user_country = this.user_info.country
        this.user_mobileNo = this.user_info.mobileNo
    }

    userBuyImage() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.width = '40%';
        dialogConfig.height = '50%';
        dialogConfig.data = {
            'userInfo': this.user_info
        }
        const dialogRef = this.dialog.open(BuyImageDialogComponent, dialogConfig);
    }

}