import { TimelineComponent } from './timeline/timeline.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MessageBarComponent } from './shared/message-bar/message-bar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ProductsComponent } from './products/products.component';
import { AddProductComponent } from './add-product/add-product.component';
import { PersonalProfileComponent } from './shared/personal-profile/personal-profile.component';
import { WinAuthInterceptor } from './services/winauth-service/winauth-interceptor';
import { ProductCrudComponent } from './product-crud/product-crud.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OverviewStatisticsComponent } from './overview-statistics/overview-statistics.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    ProductsComponent,
    AddProductComponent,
    PersonalProfileComponent,
    ProductCrudComponent,
    EditProductComponent,
    MessageBarComponent,
    ProductDetailsComponent,
    ShoppingCartComponent,
    OrdersComponent,
    OrderDetailsComponent,
    OverviewStatisticsComponent,
    StatisticsComponent,
    TimelineComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSliderModule,
    MatCheckboxModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatTableModule,
    MatInputModule,
    NgxPaginationModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    AuthGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WinAuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
