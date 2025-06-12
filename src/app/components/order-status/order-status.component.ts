import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Order, OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css'],
})
export class OrderStatusComponent implements OnInit {
  orderId!: string;
  order$!: Observable<Order>;
  fromCart = false;
  userId!: string;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;

    const userIdFromStorage = this.authService.getUserId();
    if (userIdFromStorage) {
      this.userId = userIdFromStorage;
    } else {
      this.router.navigate(['/login']);
      return;
    }

    this.order$ = this.orderService.getOrderById(this.orderId);
    const state = history.state;
    this.fromCart = state?.fromCart === true;

    // If we're not coming from cart, redirect to my orders
    if (!this.fromCart) {
      this.router.navigate(['/my-orders']);
    }
  }

  back() {
    if (this.fromCart) {
      this.router.navigate(['/cart']);
    } else {
      this.router.navigate(['/my-orders']);
    }
  }

  pay() {
    this.order$.subscribe((order) => {
      if (order.status === 'COMPLETED') return;

      alert('Payment processed.');
      this.cartService.clearCart(this.userId).subscribe(() => {
        this.orderService
          .updateOrderStatus(this.orderId, 'DELIVERED')
          .subscribe(() => {
            this.fromCart = false;
            this.router.navigate(['/my-orders']);
          });
      });
    });
  }
}
