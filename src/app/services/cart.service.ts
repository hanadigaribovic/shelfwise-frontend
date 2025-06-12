import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  cartId?: string;
  userId: string;
  bookId: string;
  title: string;
  author: string;
  quantity: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private API_URL = `${environment.apiUrl}/cart`;
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  constructor(private http: HttpClient) {}

  getCart(userId: string): void {
    this.http.get<CartItem[]>(`${this.API_URL}/${userId}`).subscribe({
      next: (items) => {
        this.cartItemsSubject.next(items);
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        this.cartItemsSubject.next([]); // Reset cart state on error
      },
    });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  addItem(item: {
    userId: string;
    bookId: string;
    title: string;
    author: string;
    price: number;
    quantity: number;
  }) {
    this.http.post<void>(this.API_URL, item).subscribe(() => {
      this.getCart(item.userId);
    });
  }

  updateQuantity(cartItemId: string, delta: number, userId: string): void {
    console.log(cartItemId, delta, userId);
    console.log('RADIS LI RADIS LI');
    this.http
      .patch<void>(`${this.API_URL}/${cartItemId}`, delta)
      .subscribe(() => {
        this.getCart(userId);
      });
  }

  removeItem(cartItemId: string, userId: string): void {
    this.http.delete<void>(`${this.API_URL}/${cartItemId}`).subscribe(() => {
      this.getCart(userId);
    });
  }

  clearCart(userId: string): Observable<void> {
    const snapshot = this.cartItemsSubject.value;
    if (snapshot.length === 0) {
      this.cartItemsSubject.next([]);
      return new Observable<void>((observer) => {
        observer.next();
        observer.complete();
      });
    }

    const deleteObservables = snapshot
      .filter((item) => item.cartId)
      .map((item) => this.http.delete<void>(`${this.API_URL}/${item.cartId}`));

    return new Observable<void>((observer) => {
      if (deleteObservables.length === 0) {
        this.cartItemsSubject.next([]);
        observer.next();
        observer.complete();
        return;
      }

      // Use forkJoin to wait for all delete operations to complete
      import('rxjs').then(({ forkJoin }) => {
        forkJoin(deleteObservables).subscribe({
          next: () => {
            this.cartItemsSubject.next([]);
            this.getCart(userId);
            observer.next();
            observer.complete();
          },
          error: (error) => observer.error(error),
        });
      });
    });
  }

  hasItem(bookId: string): boolean {
    return this.cartItemsSubject.value.some((item) => item.bookId === bookId);
  }

  getSnapshot(): CartItem[] {
    return this.cartItemsSubject.value;
  }
}
