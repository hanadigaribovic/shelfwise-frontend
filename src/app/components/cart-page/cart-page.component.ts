import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { CartItem, CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  userId!: string;

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const uid = this.auth.getUserId();
    if (uid) {
      this.userId = uid;
      this.cartService.getCart(uid);
      this.cartItems$ = this.cartService.getCartItems();
    }
  }

  remove(itemId: string) {
    this.cartService.removeItem(itemId, this.userId);
  }

  clear() {
    this.cartService.clearCart(this.userId);
  }

  goToCheckout() {
    this.router.navigate(['/new-order']);
  }

  increase(item: CartItem) {
    this.cartService.updateQuantity(item.cartId!, 1, this.userId);
  }

  decrease(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.cartId!, -1, this.userId);
    }
  }

  getTotalPrice(cartItems: CartItem[]): number {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
