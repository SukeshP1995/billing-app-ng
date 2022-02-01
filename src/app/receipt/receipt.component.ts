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
    this.totalAmount = this.format(data["totalAmount"]);
    this.discount = this.format(data["discount"]);
    this.gst = this.format(data["totalAmount"] * 0.09)
    this.netAmount = data["netAmount"];
    if (this.model == "ENGINE OIL") {
      this.netAmount = data["totalAmount"] + 2 * this.gst; 
      this.netAmount = this.format(this.netAmount);
    }
  }

  format(n: number): string {
    return (Math.round(n * 100) / 100).toFixed(2)
  }
  convertDate(inputFormat: number): string {
    function pad(s: number) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
  }

}