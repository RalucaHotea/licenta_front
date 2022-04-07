import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';
import { ImageDto } from '../models/image.model';
import { Product } from '../models/product.model';
import { Subcategory } from '../models/subcategory.model';
import { User } from '../models/user.model';
import { ProductService } from '../services/product-service/product.service';
import { MessageBarComponent } from '../shared/message-bar/message-bar.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  @ViewChild('messageBar') messageBar = {} as MessageBarComponent;
  products: Product[] = [] as Product[];
  selectedProduct: Product = {} as Product;
  showProductsDropDown = false;
  filteredProducts: Product[] = [] as Product[];
  searchContent = '';
  showContent = true;
  imageName: string;
  formErrors: string[] = [] as string[];
  formSuccesses: string[] = [] as string[];
  progress: number;
  product: Product = {} as Product;
  loggedUser: User = {} as User;
  selectedCategory = '';
  selectedSubcategory = '';
  categories: Category[] = [] as Category[];
  subcategories: Subcategory[] = [] as Subcategory[];
  clicked = false;

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
    image: new FormControl(''),
  });

  constructor(
    private productService: ProductService,
    private httpClient: HttpClient
  ) {}

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

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products;
    });
    this.productService
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));
    this.productService
      .getAllSubcategories()
      .subscribe((subcategories) => (this.subcategories = subcategories));
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

  getFormProduct(): Product {
    let imagePath =
      'https://localhost:44372/Resources/Images/' +
      this.name.value +
      '/' +
      this.imageName;
    imagePath = imagePath.replace(/\s/g, '');
    const newProduct = {
      id: this.selectedProduct.id,
      name: this.name.value,
      description: this.description.value,
      eanCode: this.eanCode.value,
      minimumQuantity: this.minimumQuantity.value,
      price: this.price.value,
      categoryId: Number(this.category.value),
      subcategoryId: Number(this.subcategory.value),
      imagePath: imagePath,
    } as Product;
    console.log(imagePath);
    return newProduct;
  }

  submitData(): void {
    if (this.form.valid) {
      const newProduct = this.getFormProduct();
      this.productService.updateProduct(newProduct).subscribe(
        () => {
          this.messageBar.addSuccessTimeOut('Product Updated Successfully');
        },
        () => {
          this.messageBar.addErrorTimeOut('Update was unsuccessful');
        }
      );
      this.form.reset();
      this.searchContent = '';
      this.selectedProduct = undefined;
      this.loadData();
      this.imageName = null;
    }
  }

  deleteProduct(): void {
    const product = this.selectedProduct as Product;
    this.productService
      .deleteProduct(product.id)
      .subscribe(() =>
        this.messageBar.addSuccessTimeOut('Product Deleted Successfully')
      );
    this.selectedProduct = undefined;
    this.searchContent = '';
    this.form.reset();
    this.loadData();
  }

  searchOnFocus(): void {
    this.showProductsDropDown = true;
  }

  searchOnBlur(): void {
    this.showProductsDropDown = false;
  }

  filterProducts(): void {
    const newProducts: Product[] = [];
    if (this.searchContent.length > 0) {
      this.filteredProducts = this.products;

      for (const product of this.filteredProducts) {
        const searchContent = this.searchContent.toUpperCase();
        const name = product.name.toUpperCase();

        if (
          name.includes(searchContent) ||
          product.description.includes(searchContent)
        ) {
          newProducts.push(product);
        }
      }
    }
    this.filteredProducts = newProducts;
  }

  selectProduct(product: Product): void {
    this.form.reset();
    this.selectedProduct = product;
    this.searchContent = product.name;
    this.form.patchValue({
      name: product.name,
      description: product.description,
      eanCode: product.eanCode,
      minimumQuantity: product.minimumQuantity,
      price: product.price,
      category: product.categoryId,
      subcategory: product.subcategoryId,
      imagePath: product.imagePath,
    });
    this.showProductsDropDown = false;
  }
}
