import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
    paymentBlock: any;
    constructor() { }

    get userInfo() {
        return JSON.parse(localStorage.getItem('userInfo'))
    }

    set userInfo(userData: any) {
        localStorage.setItem('userInfo', JSON.stringify(userData))
    }

    get paymentData() {
        return JSON.parse(localStorage.getItem('paymentInfo'))
    }

    set paymentData(paymentData: any) {
        localStorage.setItem('paymentInfo', JSON.stringify(paymentData))
    }

    get userPlanData() {
        return JSON.parse(localStorage.getItem('userPlanInfo'))
    }

    set userPlanData(planData: any) {
        localStorage.setItem('userPlanInfo', JSON.stringify(planData))
    }
}