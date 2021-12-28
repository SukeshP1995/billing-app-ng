import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { RequestService } from '../request.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { BillSummaryComponent } from '../bill-summary/bill-summary.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bill-form',
  templateUrl: './bill-form.component.html',
  styleUrls: ['./bill-form.component.css']
})
export class BillFormComponent implements OnInit {

  public models!: [string];

  public accessoriesForm!: FormGroup;

  public modelSelected = false;

  constructor(
    private formBuilder: FormBuilder, 
    private req: RequestService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.req.getModels().subscribe((data: any) => {
      this.models = data
    });
  }

  get accessories() : FormArray {
    return this.accessoriesForm.get("accessories") as FormArray
  }

  get halfKitItems() : FormArray {
    return this.accessoriesForm.get("halfKitItems") as FormArray
  }

  get fullKitItems() : FormArray {
    return this.accessoriesForm.get("fullKitItems") as FormArray
  }

  setForm(selectedModel: any) {
    this.req.getData(selectedModel).subscribe((data: any) => {
      this.modelSelected = true;
      this.accessoriesForm = this.formBuilder.group({
        customerName: new FormControl(undefined, Validators.required), 
        model: new FormControl({value: data['model'], disabled: true}, Validators.required),
        halfKitItems: this.formBuilder.array(data['halfKitItems'].map((name: any) => this.formBuilder.group({
          name: new FormControl({value: name, disabled: true}, Validators.required),
        }))),
        fullKitItems: this.formBuilder.array(data['fullKitItems'].map((name: any) => this.formBuilder.group({
          name: new FormControl({value: name, disabled: true}, Validators.required),
        }))),
        
        halfKitHsn: new FormControl({value: data['halfKitHsn'], disabled: true}, Validators.required),
        fullKitHsn: new FormControl({value: data['fullKitHsn'], disabled: true}, Validators.required),
        halfKitPrice: new FormControl({value: data['halfKitPrice'], disabled: true}, Validators.required),
        fullKitPrice: new FormControl({value: data['fullKitPrice'], disabled: true}, Validators.required),
        halfKitQuantity: new FormControl(0, Validators.required),
        fullKitQuantity: new FormControl(0, Validators.required),
        halfKitTotalPrice: new FormControl({value: 0, disabled: true}, Validators.required),
        fullKitTotalPrice: new FormControl({value: 0, disabled: true}, Validators.required),
        accessories: this.formBuilder.array(data['accessories'].map((data: any) => this.formBuilder.group({
            name: new FormControl({value: data.name, disabled: true}, Validators.required),
            hsn: new FormControl({value: data.hsn, disabled: true},Validators.required),
            price: new FormControl({value: data.price, disabled: true}, Validators.required),
            quantity: new FormControl(0, Validators.required),
            totalPrice: new FormControl({value: 0, disabled: true}, Validators.required)
          })
        )),
      });

      this.accessoriesForm.get('halfKitQuantity')?.valueChanges.subscribe((quantity) => {
        this.accessoriesForm.get('halfKitTotalPrice')?.setValue(quantity * this.accessoriesForm.get('halfKitPrice')?.value);
      });

      this.accessoriesForm.get('fullKitQuantity')?.valueChanges.subscribe((quantity) => {
        this.accessoriesForm.get('fullKitTotalPrice')?.setValue(quantity * this.accessoriesForm.get('fullKitPrice')?.value);
      });

      this.accessories.controls.map(control => {
        control.get('quantity')?.valueChanges.subscribe(quantity => {
          control.get('totalPrice')?.setValue(quantity * control.get('price')?.value);
        });
      });
    });
    
  }

  onSubmit() {
    let data = {...this.accessoriesForm.getRawValue()};
    data["accessories"] = [...[
      {
        name: "HALF KIT",
        hsn: data["halfKitHsn"],
        price: data["halfKitPrice"],
        quantity: data["halfKitQuantity"],
        totalPrice: data["halfKitTotalPrice"]
      },
      {
        name: "FULL KIT",
        hsn: data["fullKitHsn"],
        price: data["fullKitPrice"],
        quantity: data["fullKitQuantity"],
        totalPrice: data["fullKitTotalPrice"]
      }
    ], ...data["accessories"]].filter(ele => ele["quantity"] > 0);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.accessories.controls
          .map(control => control.get('totalPrice')?.value)
          .reduce((sum, current) => sum + current, this.accessoriesForm.get('halfKitTotalPrice')?.value + this.accessoriesForm.get('fullKitTotalPrice')?.value);
    let dialogRef = this.dialog.open(BillSummaryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      data = {...data, ...result}
      // this.req.sale(data).subscribe((sno: any) => {
        // this.router.navigate(['/receipt'], {state: {sno: sno['sno'], ...data}})
      // });
      this.router.navigate(['/receipt'], {state: {sno: "123456789", ...data}})
      
    });
    
  }

}
