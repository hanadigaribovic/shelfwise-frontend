import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { PlatformLayoutComponent } from './components/platform-layout/platform-layout.component';
import { BooksPageComponent } from './components/books-page/books-page.component';
import { BookComponent } from './components/books-page/book/book.component';
import { CartPageComponent } from './components/cart-page/cart-page.component';
import { WishlistComponent } from './components/wishlist-page/wishlist-page.component';
import { OrderPageComponent } from './components/order-page/order-page.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { MyOrdersPageComponent } from './components/my-orders-page/my-orders-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  {
    path: '',
    component: PlatformLayoutComponent,
    children: [
      { path: 'books', component: BooksPageComponent },
      { path: 'books/:id', component: BookComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'my-orders', component: MyOrdersPageComponent },
      { path: 'new-order', component: OrderPageComponent },
      { path: 'new-order/:id', component: OrderStatusComponent },
    ],
  },
  { path: '**', component: HomePageComponent },
];
