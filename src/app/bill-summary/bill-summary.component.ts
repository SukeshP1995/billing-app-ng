import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-bill-summary',
  templateUrl: './bill-summary.component.html',
  styleUrls: ['./bill-summary.component.css']
})
export class BillSummaryComponent implements OnInit {

  public form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    public dialogRef: MatDialogRef<BillSummaryComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      totalAmount: new FormControl({value: this.data, disabled: true}, Validators.required),
      discount: new FormControl({value: 0, disabled: true}, Validators.required),
      netAmount: new FormControl(this.data, Validators.required),
    });

    this.form.get('netAmount')?.valueChanges.subscribe(netAmount => {
      this.form.get('discount')?.setValue(this.form.get('totalAmount')?.value - netAmount);
    })
  }

  close() {
    this.dialogRef.close("closed");
  }

  onSubmit() {
    this.dialogRef.close(this.form.getRawValue());
  }

}
