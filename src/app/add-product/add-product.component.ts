import { User } from 'src/app/models/user.model';
import { ImageDto } from './../models/image.model';
import { ProductService } from './../services/product-service/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../models/product.model';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
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
  uploadedImages = [] as File[];
  imagesNames = [] as string[];
  progress: number;
  product: Product = {} as Product;
  loggedUser: User = {} as User;
  selectedCategory = '';
  selectedSubcategory = '';
  categories: Category[] = [] as Category[];
  subcategories: Subcategory[] = [] as Subcategory[];
  formErrors: string[] = [] as string[];
  formSuccesses: string[] = [] as string[];
  isValidForm = false;

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]*$'),
    ]),
    description: new FormControl(null, Validators.required),
    eanCode: new FormControl(null, Validators.required),
    minimumQuantity: new FormControl(''),
    category: new FormControl(null, Validators.required),
    subcategory: new FormControl(null, Validators.required),
    price: new FormControl(null, Validators.required),
    images: new FormControl(''),
    orderEntityId: new FormControl(''),
  });
  fileUploadProgress: number;
  messageService: any;
  onUploadFinished: any;

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get eanCode(): FormControl {
    return this.form.get('eanCode') as FormControl;
  }

  get minimumQuantity(): FormControl {
    return this.form.get('minimumQuantity') as FormControl;
  }

  get category(): FormControl {
    return this.form.get('category') as FormControl;
  }

  get images(): FormControl {
    return this.form.get('images') as FormControl;
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
  }

  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let filesToUpload: File[] = files;
    this.uploadedImages.push(filesToUpload[0]);
    const formData = new FormData();

    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file' + index, file, file.name);
    });

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
    this.uploadedImages.splice(file, 1);
  }

  downloadFile(productId: number, fileId: number, filename: string) {
    this.productService
      .downloadFile(productId, fileId)
      .subscribe((response: HttpResponse<Blob>) => {
        const binaryData = [];
        binaryData.push(response.body);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: 'blob' })
        );
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  getFormProduct(): Product {
    let images = [] as ImageDto[];
    if (this.uploadedImages.length != 0) {
      this.uploadedImages.forEach((image) => {
        let newImage = {
          id: 0,
          imageName: image.name,
          location: null,
        };
        images.push(newImage);
      });
    } else {
      images = null;
    }
    const newProduct = {
      id: 0,
      name: this.name.value,
      description: this.description.value,
      eanCode: this.eanCode.value,
      minimumQuantity: this.minimumQuantity.value,
      price: this.price.value,
      categoryId: Number(this.category.value),
      subcategoryId: Number(this.subcategory.value),
      images: images,
    } as Product;
    return newProduct;
  }

  submitData(): void {
    const newProduct = this.getFormProduct();
    this.productService
      .addProduct(newProduct)
      .subscribe(() =>
        this.messageBar.addSuccessTimeOut('Product Added Successfully')
      );
    this.form.reset();
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

  selectSubcategory(event: Event) {
    this.selectedSubcategory = (event.target as HTMLSelectElement).value;
  }
}
