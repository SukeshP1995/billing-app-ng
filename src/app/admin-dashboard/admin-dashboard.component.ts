import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { RequestService } from '../request.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  public accessoriesForm!: FormGroup;

  public models!: [string];

  public isLoading!:boolean;

  constructor(
    private formBuilder: FormBuilder, 
    private _snackBar: MatSnackBar,
    private req: RequestService
  ) { }

  ngOnInit(): void {
    this.req.getModels().subscribe((data: any) => {
      this.models = data
    });
    this.setForm(undefined);
    this.isLoading = false;
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

  createAccessory(): FormGroup {
    return this.formBuilder.group({
      name: new FormControl('', Validators.required),
      hsn: new FormControl('', Validators.required),
      price: new FormControl(0, Validators.required),
      quantity: new FormControl(0, Validators.required)
    });
  }

  createhalfKitItem(): FormGroup {
    return this.formBuilder.group({
      name: new FormControl('', Validators.required),
    });
  }

  createfullKitItem(): FormGroup {
    return this.formBuilder.group({
      name: new FormControl('', Validators.required),
    });
  }

  addAccessory(): void {
    this.accessories.push(this.createAccessory());
  }

  addhalfKitItem(): void {
    this.halfKitItems.push(this.createhalfKitItem());
  }

  addfullKitItem(): void {
    this.fullKitItems.push(this.createfullKitItem());
  }
  
  removeAccessory(i:number) {
    this.accessories.removeAt(i);
  }

  removehalfKitItem(i:number) {
    this.halfKitItems.removeAt(i);
  }

  removefullKitItem(i:number) {
    this.fullKitItems.removeAt(i);
  }

  setForm(selectedModel: string | number | boolean | undefined) {
    if (selectedModel !== undefined) {
      this.isLoading = true;
      this.req.getData(selectedModel).subscribe((data:any) => {
        this.accessoriesForm = this.formBuilder.group({
          model: new FormControl(data['model'], Validators.required),
          halfKitItems: this.formBuilder.array(data['halfKitItems'].map((name: any) => this.formBuilder.group({
            name: new FormControl(name, Validators.required),
          }))),
          fullKitItems: this.formBuilder.array(data['fullKitItems'].map((name: any) => this.formBuilder.group({
            name: new FormControl(name, Validators.required),
          }))),
          halfKitHsn: new FormControl(data['halfKitHsn'], Validators.required),
          fullKitHsn: new FormControl(data['fullKitHsn'], Validators.required),
          halfKitPrice: new FormControl(data['halfKitPrice'], Validators.required),
          fullKitPrice: new FormControl(data['fullKitPrice'], Validators.required),
          halfKitQuantity: new FormControl(data['halfKitQuantity'], Validators.required),
          fullKitQuantity: new FormControl(data['fullKitQuantity'], Validators.required),
          accessories: this.formBuilder.array(data['accessories'].map((data: any) => this.formBuilder.group({
              name: new FormControl(data.name, Validators.required),
              hsn: new FormControl(data.hsn, Validators.required),
              price: new FormControl(data.price, Validators.required),
              quantity: new FormControl(data.quantity, Validators.required)
            })
          )),
        });
        this.isLoading = false;
      });
    }
    else {
      this.accessoriesForm = this.formBuilder.group({
        model: new FormControl('', Validators.required),
        halfKitItems: this.formBuilder.array([]),
        fullKitItems: this.formBuilder.array([]),
        halfKitHsn: new FormControl('', Validators.required),
        fullKitHsn: new FormControl('', Validators.required),
        halfKitPrice: new FormControl(0, Validators.required),
        fullKitPrice: new FormControl(0, Validators.required),
        halfKitQuantity: new FormControl(0, Validators.required),
        fullKitQuantity: new FormControl(0, Validators.required),
        accessories: this.formBuilder.array([]),
      });
    }
  }

  onSubmit() {
    let data = {...this.accessoriesForm.getRawValue()};
    data['halfKitItems'] = data['halfKitItems'].map((v: { [x: string]: any; })=> v["name"]);
    data['fullKitItems'] = data['fullKitItems'].map((v: { [x: string]: any; })=> v["name"]);
    this.req.postData(data).subscribe((d) => {
      this._snackBar.open("submitted", "close", {
        duration: 2000,
      });
    });
  }

}