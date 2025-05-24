import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Order, OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
// import { Observable } from 'rxjs'; // ✅ Uncomment if you use observables for order

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css'],
})
export class OrderStatusComponent implements OnInit {
  orderId!: string;
  order!: Order | undefined; // ✅ mock-based
  // order$!: Observable<Order>; // ✅ backend-compatible version

  fromCart = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;

    // ✅ MOCK:
    this.order = this.orderService.getOrderById(this.orderId);

    // ✅ HTTP (future):
    // this.order$ = this.orderService.getOrderById(this.orderId);

    const state = history.state;
    this.fromCart = !!state.fromCart;
  }

  back() {
    history.back();
  }

  pay() {
    if (!this.order) return;

    if (this.order.status === 'COMPLETED') return;

    alert('Payment processed.');
    this.cartService.clearCart();

    // ✅ mock:
    this.order.status = 'COMPLETED';

    // ✅ backend (future):
    // this.orderService.markAsPaid(this.order.id).subscribe(() => {
    //   this.router.navigate(['/my-orders']);
    // });

    this.router.navigate(['/my-orders']);
  }
}
