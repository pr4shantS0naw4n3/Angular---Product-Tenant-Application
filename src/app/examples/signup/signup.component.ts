import { NotificationService } from './../../shared/notification.service';
import { Router } from '@angular/router';
import { ApiService } from './../../shared/api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as $ from 'jquery';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    focus: any;
    focus1: any;
    hasError = false;
    error: any;
    registerFrom = new FormGroup({
        emailId: new FormControl(''),
        password: new FormControl(''),
        fullname: new FormControl(''),
        country: new FormControl(''),
        DOB: new FormControl(''),
        mobileNo: new FormControl('')
    })

    countrys = [
        { 'countryName': 'UNITED - STATES' },
        { 'countryName': 'UNITED - KINGDOM' },
        { 'countryName': 'AUSTRALIA' },
        { 'countryName': 'CANADA' },
        { 'countryName': 'IRELAND' }
    ]
    constructor(
        private apiservice: ApiService,
        private notification: NotificationService,
        public router: Router
    ) {
    }

    ngOnInit() { }

    register() {
        console.log(this.registerFrom.value);
        this.apiservice.registerNewUser(this.registerFrom.value).subscribe(data => {
            console.log(data);
            if (data['responseStatus'] === 200) {
                this.hasError = false;
                this.notification.pop(data['responseMessage'])
                this.router.navigate(['/login'])
            }
        }, (errorData) => {
            this.hasError = true;
            this.error = errorData.error
            this.notification.pop(errorData['responseMessage'])
        });
    }
}
