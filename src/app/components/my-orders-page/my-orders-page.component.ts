import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service'; // Importiraj OrderService
import { AuthService } from '../../services/auth.service'; // Importiraj AuthService
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-orders-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders-page.component.html',
  styleUrls: ['./my-orders-page.component.css'],
})
export class MyOrdersPageComponent implements OnInit {
  orders: Order[] = []; // Ovo će se koristiti za prikaz narudžbi
  orders$!: Observable<Order[]>; // Observable verzija za backend integraciju
  userId!: string;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService // Da bismo dohvatili userId
  ) {}

  ngOnInit(): void {
    const userIdFromStorage = this.authService.getUserId();
    if (userIdFromStorage) {
      this.userId = userIdFromStorage;
      this.orders$ = this.orderService.getAllOrders(this.userId);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToOrder(id: string) {
    // Kada korisnik klikne na narudžbu, preusmjeravamo ga na stranicu s detaljima te narudžbe
    this.router.navigate(['/new-order', id]);
  }
}
