import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { CartDto, CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, MatIconModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
  standalone: true,
})
export class CartPageComponent {
  cartItems$!: Observable<CartDto[]>;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // ✅ MOCK:
    //this.cartItems$ = this.cartService.getCartItems();
    //OVDJE HALOOOOOOOOOOOOOOOO
  }

  increase(id: string) {
    // ✅ MOCK only
    this.cartService.updateQuantity(id, 1);

    // ✅ HTTP version (future)
    // this.cartService.updateQuantity(id, 1).subscribe();
  }

  decrease(id: string) {
    this.cartService.updateQuantity(id, -1);
  }

  remove(id: string) {
    this.cartService.removeItem(id);
  }

  // clear() {
  //   this.cartService.clearCart();
  // }

  order() {
    this.router.navigate(['/new-order']);
  }
}
