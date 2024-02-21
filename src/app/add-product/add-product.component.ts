import { Warehouse } from './../models/warehouse.model';
import { User } from 'src/app/models/user.model';
import { ProductService } from './../services/product-service/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../models/product.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Subcategory } from '../models/subcategory.model';
import { Category } from '../models/category.model';
import { MessageBarComponent } from '../shared/message-bar/message-bar.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  @ViewChild('messageBar') messageBar = {} as MessageBarComponent;
  isCategorySelected = false;
  isSubcategorySelected = false;
  isDescriptionEditorTouched = false;
  isValidForm = false;
  imageName: string;
  progress: number;
  product: Product = {} as Product;
  loggedUser: User = {} as User;
  selectedWarehouse = '';
  selectedCategory = '';
  selectedSubcategory = '';
  categories: Category[] = [] as Category[];
  warehouses: Warehouse[] = [] as Warehouse[];
  subcategories: Subcategory[] = [] as Subcategory[];
  formErrors: string[] = [] as string[];
  formSuccesses: string[] = [] as string[];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [Validators.required]),
    eanCode: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(13),
      Validators.pattern('^[0-9]*$'),
    ]),
    category: new FormControl(null, Validators.required),
    subcategory: new FormControl(null, Validators.required),
    stock: new FormControl(null, Validators.required),
    warehouse: new FormControl(null, Validators.required),
    price: new FormControl(null, Validators.required),
    image: new FormControl(''),
  });

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get eanCode(): FormControl {
    return this.form.get('eanCode') as FormControl;
  }

  get category(): FormControl {
    return this.form.get('category') as FormControl;
  }

  get image(): FormControl {
    return this.form.get('image') as FormControl;
  }

  get subcategory(): FormControl {
    return this.form.get('subcategory') as FormControl;
  }

  get price(): FormControl {
    return this.form.get('price') as FormControl;
  }

  get orderEntityId(): FormControl {
    return this.form.get('orderEntityId') as FormControl;
  }

  get stock(): FormControl {
    return this.form.get('stock') as FormControl;
  }

  get warehouse(): FormControl {
    return this.form.get('warehouse') as FormControl;
  }

  constructor(
    private productService: ProductService,
    private httpClient: HttpClient,
    public authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loggedUser = this.authService.getLoggedUser();
    this.productService
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));
    this.productService.getAllWarehouses().subscribe((warehouses) => {
      this.warehouses = warehouses;
    });
  }

  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.imageName = fileToUpload.name;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.httpClient
      .put(
        environment.apiUrl + 'Product/UploadImage/' + this.name.value,
        formData,
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .subscribe();
  };

  removeFile(file) {
    this.productService.removeFile(file);
    this.imageName = null;
  }

  getFormProduct(): Product {
    let imagePath =
      'https://localhost:44372/Resources/Images/' +
      this.name.value +
      '/' +
      this.imageName;
    imagePath = imagePath.replace(/\s/g, '');
    const newProduct = {
      id: 0,
      name: this.name.value,
      description: this.description.value,
      eanCode: this.eanCode.value,
      price: this.price.value,
      categoryId: Number(this.category.value),
      subcategoryId: Number(this.subcategory.value),
      imagePath: imagePath,
      quantity: this.stock.value,
      warehouseId: Number(this.warehouse.value),
    } as Product;
    return newProduct;
  }

  submitData(): void {
    if (this.form.valid && this.imageName != null) {
      const newProduct = this.getFormProduct();
      this.productService.addProduct(newProduct).subscribe(
        () => {
          this.messageBar.addSuccessTimeOut('Product Added Successfully');
        },
        () => {
          this.messageBar.addErrorTimeOut('Submission was unsuccessful');
        }
      );
      this.form.reset();
      this.imageName = null;
    }
  }

  selectCategory(event: Event) {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.productService
      .getAllSubcategoriesByCategoryId(Number(this.category.value))
      .subscribe(
        (subcategories) => {
          this.subcategories = subcategories;
        },
        () => {
          this.formErrors.push('No Subcategories for this Category');
        }
      );
  }

  selectWarehouse(event: Event) {
    this.selectedWarehouse = (event.target as HTMLSelectElement).value;
  }

  touchDescriptionEditor(): void {
    this.isDescriptionEditorTouched = true;
  }

  selectSubcategory(event: Event) {
    this.selectedSubcategory = (event.target as HTMLSelectElement).value;
  }
}
