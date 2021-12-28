import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

  public customerName: any;
  public model: any;
  public accessories: any;
  public totalAmount: any;
  public discount: any;
  public netAmount: any;
  public gst: any;
  public sno: any;
  public today: any;
  
  constructor() { }

  ngOnInit(): void {
    const data = window.history.state;
    this.today = this.convertDate(Date.now())
    this.sno = data['sno'];
    this.customerName = data['customerName'];
    this.model = data['model'];
    this.accessories = data["accessories"];
    console.log(this.model);
    this.totalAmount = data["totalAmount"];
    this.discount = data["discount"];
    this.gst = data["totalAmount"] * 0.09
    this.netAmount = data["netAmount"];
    if (this.model == "ENGINE OIL") {
      this.netAmount = data["totalAmount"] + 2 * this.gst; 
      this.netAmount = (Math.round(this.netAmount * 100) / 100).toFixed(2)
    }
    console.log(this.totalAmount);
    console.log(this.netAmount);
  }

  convertDate(inputFormat: number): string {
    function pad(s: number) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
  }

}