import { Observable } from 'rxjs';
import { ProductService } from './../services/product-service/product.service';
import { Product } from './../models/product.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../models/category.model';
import { Subcategory } from '../models/subcategory.model';
import { TableFilter } from '../models/table-filter.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  data: Observable<Product>;
  dataSource = new MatTableDataSource<Product>();
  selectedCategory = '';
  selectedSubcategory = '';
  numberOfProducts: number;
  totalPages: number;
  limitPageNumber = 5;
  paginationSize = 7;
  p: number = 1;
  categories: Category[] = [] as Category[];
  subcategories: Subcategory[] = [] as Subcategory[];

  displayedColumns: string[] = ['name', 'category', 'subcategory', 'details'];
  headerInputs: string[] = [
    'input-name',
    'input-category',
    'input-subcategory',
    'input-details',
  ];
  filterSelectObj: TableFilter[] = [
    {
      EnumValue: -1,
      Value: '',
      ColumnProp: 'category',
      Options: [],
    },
    {
      EnumValue: -1,
      Value: '',
      ColumnProp: 'subcategory',
      Options: [],
    },
    {
      EnumValue: -1,
      Value: '',
      ColumnProp: 'name',
      Options: [],
    },
  ];

  products: Product[] = [] as Product[];
  filteredProducts: Product[] = [] as Product[];
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe((products) => {
      if (products) {
        this.products = products;
        this.filteredProducts = products;
        this.numberOfProducts = products.length;
        this.totalPages = Math.ceil(
          this.numberOfProducts / this.limitPageNumber
        );
      }
    });
    this.productService
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));
    this.productService
      .getAllSubcategories()
      .subscribe((subcategories) => (this.subcategories = subcategories));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  selectCategory(event: Event) {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.productService
      .getAllSubcategoriesByCategoryId(Number(this.selectedCategory))
      .subscribe((subcategories) => {
        this.subcategories = subcategories;
      });
    this.filteredProducts = this.products.filter(
      (x) => x.categoryId == Number(this.selectedCategory)
    );
  }

  selectSubcategory(event: Event) {
    this.selectedSubcategory = (event.target as HTMLSelectElement).value;
    this.filteredProducts = this.products.filter(
      (x) => x.subcategoryId == Number(this.selectedSubcategory)
    );
  }

  getFilterByColumnProp(columnProp: string): TableFilter {
    return (
      this.filterSelectObj.find((x) => x.ColumnProp === columnProp) ??
      ({} as TableFilter)
    );
  }

  filterChanged() {
    this.dataSource.data = this.products.filter((idea) => {
      let result = true;
      for (const filter of this.filterSelectObj) {
        if (
          (idea[filter.ColumnProp] == null && filter.Value !== '') ||
          (filter.Value !== '' &&
            !idea[filter.ColumnProp]
              .toLocaleLowerCase()
              .includes(filter.Value.toLocaleLowerCase())) ||
          (filter.EnumValue != -1 &&
            idea[filter.ColumnProp] != filter.EnumValue)
        ) {
          result = false;
          break;
        }
      }
      return result;
    });
  }
}
