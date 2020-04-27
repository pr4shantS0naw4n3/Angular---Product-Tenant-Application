import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {

  orderNo: any;
  constructor() { }

  ngOnInit(): void {
    this.orderNo = Math.floor(100000000 + Math.random() * 900000000000)
  }

}
