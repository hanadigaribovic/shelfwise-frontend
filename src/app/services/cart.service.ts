import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
// import { HttpClient } from '@angular/common/http'; // ✅ Uncomment when backend is ready

export interface CartItem {
  id: string;
  title: string;
  author: string;
  quantity: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([
    {
      id: '1',
      title: 'Story about John Doe',
      author: 'John Doe',
      quantity: 1,
      price: 12.0,
    },
    {
      id: '2',
      title: 'Story about John Doe',
      author: 'John Doe',
      quantity: 1,
      price: 12.0,
    },
    {
      id: '3',
      title: 'Story about John Doe',
      author: 'John Doe',
      quantity: 1,
      price: 12.0,
    },
  ]);

  // constructor(private http: HttpClient) {} // ✅ Use this when backend is ready
  constructor() {} // 👈 mock version

  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();

    // ✅ Future backend call
    // return this.http.get<CartItem[]>('/api/cart');
  }

  addItem(item: CartItem) {
    const existing = this.cartItemsSubject.value.find((i) => i.id === item.id);
    if (!existing) {
      this.cartItemsSubject.next([...this.cartItemsSubject.value, item]);
    }

    // ✅ Future backend call
    // return this.http.post<void>('/api/cart', item);
  }

  removeItem(id: string): void {
    const items = this.cartItemsSubject.value.filter((item) => item.id !== id);
    this.cartItemsSubject.next(items);

    // ✅ Future backend call
    // return this.http.delete<void>(`/api/cart/${id}`);
  }

  updateQuantity(id: string, delta: number): void {
    const items = this.cartItemsSubject.value.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
        : item
    );
    this.cartItemsSubject.next(items);

    // ✅ Future backend call
    // return this.http.patch<void>(`/api/cart/${id}`, { delta });
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);

    // ✅ Future backend call
    // return this.http.delete<void>('/api/cart');
  }

  hasItem(id: string): boolean {
    return this.cartItemsSubject.value.some((item) => item.id === id);

    // ✅ If server-side cart logic is added, replace this:
    // return this.getCartItems().pipe(map(items => items.some(i => i.id === id)));
  }

  getCartItemsSnapshot(): CartItem[] {
    return this.cartItemsSubject.value;
  }
}
