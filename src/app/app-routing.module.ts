import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsComponent } from './products/products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './login/login.component';
import { AddProductComponent } from './add-product/add-product.component';
import { PersonalProfileComponent } from './shared/personal-profile/personal-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductCrudComponent } from './product-crud/product-crud.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product-crud',
    component: ProductCrudComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/productdetails/:id',
    component: ProductDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: PersonalProfileComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'orders/ordersDetails/:id',
    component: OrderDetailsComponent,
  },
  {
    path: 'cart',
    component: ShoppingCartComponent,
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
