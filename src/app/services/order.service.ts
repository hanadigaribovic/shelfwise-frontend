import { Injectable } from '@angular/core';
import { CartItem } from './cart.service';
// import { HttpClient } from '@angular/common/http'; // ✅ Uncomment when backend is ready
// import { Observable } from 'rxjs'; // ✅ Uncomment when using real requests

export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string; // "DELIVERING", "PENDING"
  daysLeft: number;
  eta: string;
  items: OrderItem[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private orders: Order[] = [
    {
      id: '734KPC',
      status: 'DELIVERING',
      daysLeft: 3,
      eta: 'Mar 19, 10:16 PM',
      items: [
        { title: 'Story about John Doe', quantity: 1, price: 12 },
        { title: 'Story about John Doe', quantity: 1, price: 12 },
        { title: 'Story about John Doe', quantity: 1, price: 12 },
      ],
      total: 36,
    },
  ];

  // constructor(private http: HttpClient) {} // ✅ For backend version
  constructor() {} // 👈 Mock mode

  getAllOrders(): Order[] {
    return this.orders;

    // ✅ Future backend call
    // return this.http.get<Order[]>('/api/orders');
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);

    // ✅ Future backend call
    // return this.http.get<Order>(`/api/orders/${id}`);
  }

  createOrder(
    cartItems: CartItem[],
    form: { name: string; phone: string; address: string }
  ): string {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const eta = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleString();

    const newOrder: Order = {
      id,
      status: 'DELIVERING',
      daysLeft: 3,
      eta,
      items: cartItems.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
      })),
      total,
    };

    this.orders.push(newOrder);
    return id;

    // ✅ Future backend call
    // return this.http.post<{ id: string }>('/api/orders', { cartItems, ...form });
  }
}
