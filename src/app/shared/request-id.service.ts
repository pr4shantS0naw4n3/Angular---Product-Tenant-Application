import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestIdService {
  dateVal: any; // = new Date;
  dateVal1: any; // = new Date();
  length = 4;
  requestId: any; //  = 'TOML' + Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  partnerId = 'MOCK';
  randomNo: string;

  constructor() { }
  getRequestId() {
    this.dateVal = new Date();
    this.dateVal1 = [this.dateVal.getMonth() + 1,
    this.dateVal.getDate(),
    this.dateVal.getFullYear(), // ].join('/') + ' ' +
    this.dateVal.getHours(),
    this.dateVal.getMinutes(),
    this.dateVal.getSeconds()].join(':');
    this.dateVal1 = this.dateVal1.split(':');
    this.dateVal1 = this.dateVal1[0] + this.dateVal1[1] + this.dateVal1[2] + this.dateVal1[3] + this.dateVal1[4] + this.dateVal1[5];
    // ["Mon", "Dec", "24", "2018", "13:45:31", "GMT+0530", "(India", "Standard", "Time)"]
    this.requestId = this.partnerId + this.dateVal1 + Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    return this.requestId;
  }

}
