import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
})
export class OrderPageComponent {
  total = 0;
  firstName = '';
  phoneNumber = '';
  address = '';
  userId!: string;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userIdFromStorage = this.authService.getUserId();

    if (userIdFromStorage) {
      this.userId = userIdFromStorage;
    } else {
      this.router.navigate(['/login']);
    }

    this.cartService.getCartItems().subscribe((items) => {
      this.total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    });
  }

  submitOrder() {
    this.cartService.getCartItems().subscribe((items) => {
      this.orderService
        .createOrder(this.userId, items, {
          name: this.firstName,
          phone: this.phoneNumber,
          address: this.address,
        })
        .subscribe((order) => {
          this.router.navigate(['/new-order', order.id], {
            state: { fromCart: true },
          });
        });
    });
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}
