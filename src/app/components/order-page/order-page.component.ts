import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { firstValueFrom } from 'rxjs'; // ✅ uncomment for async/await with HTTP

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css',
})
export class OrderPageComponent {
  total = 0;
  firstName = '';
  phoneNumber = '';
  address = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ MOCK: sync cart snapshot
    this.total = this.cartService
      .getCartItemsSnapshot()
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ✅ HTTP-ready version:
    // this.cartService.getCartItems().subscribe(items => {
    //   this.total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // });
  }

  submitOrder() {
    // ✅ MOCK version
    const cartItems = this.cartService.getCartItemsSnapshot();
    const orderId = this.orderService.createOrder(cartItems, {
      name: this.firstName,
      phone: this.phoneNumber,
      address: this.address,
    });

    // this.cartService.clearCart(); // 👈 moved to order-status after payment
    this.router.navigate(['/new-order', orderId], {
      state: { fromCart: true },
    });

    // ✅ HTTP version (uncomment if using real API)
    /*
    this.cartService.getCartItems().subscribe(cartItems => {
      this.orderService.createOrder(cartItems, {
        name: this.firstName,
        phone: this.phoneNumber,
        address: this.address,
      }).subscribe(orderId => {
        this.router.navigate(['/new-order', orderId], {
          state: { fromCart: true },
        });
      });
    });
    */

    // ✅ Alternative (with async/await)
    /*
    const cartItems = await firstValueFrom(this.cartService.getCartItems());
    const orderId = await firstValueFrom(this.orderService.createOrder(cartItems, {
      name: this.firstName,
      phone: this.phoneNumber,
      address: this.address,
    }));
    this.router.navigate(['/new-order', orderId], {
      state: { fromCart: true },
    });
    */
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}
