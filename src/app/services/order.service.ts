import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';
import { environment } from '../../environments/environment';

export interface Order {
  id: string;
  userId: string;
  status: string;
  totalPrice: number;
  orderDate: string;
  daysLeft: number;
  eta: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) {}

  getAllOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  createOrder(
    userId: string,
    cartItems: CartItem[],
    shippingDetails: { name: string; phone: string; address: string }
  ): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/${userId}`, {});
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${orderId}/status`, {
      status,
    });
  }
}
