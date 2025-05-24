import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';
// import { Observable } from 'rxjs'; // ✅ for future HTTP use

@Component({
  selector: 'app-my-orders-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders-page.component.html',
  styleUrls: ['./my-orders-page.component.css'],
})
export class MyOrdersPageComponent implements OnInit {
  orders: Order[] = []; // ✅ mock-based
  // orders$!: Observable<Order[]>; // ✅ backend-compatible version

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    // ✅ MOCK version
    this.orders = this.orderService.getAllOrders();

    // ✅ HTTP version
    // this.orders$ = this.orderService.getAllOrders();
    // or if using `subscribe` instead of `async` in template:
    // this.orderService.getAllOrders().subscribe(data => this.orders = data);
  }

  goToOrder(id: string) {
    this.router.navigate(['/new-order', id]);
  }
}
