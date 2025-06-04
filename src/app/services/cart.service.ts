import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AddToCartDto {
  userId: string;
  bookId: string;
  quantity: number;
}

export interface CartDto {
  id: string; // backend vraća 'id' kao cart item id
  userId: string;
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartDto[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCartItems(userId: string): Observable<CartDto[]> {
    return this.http
      .get<CartDto[]>(`${environment.apiUrl}/cart/${userId}`)
      .pipe(tap((items) => this.cartSubject.next(items)));
  }

  addItem(dto: AddToCartDto): Observable<CartDto> {
    return this.http.post<CartDto>(`${environment.apiUrl}/cart`, dto).pipe(
      tap((newItem) => {
        const updated = [...this.cartSubject.value, newItem];
        this.cartSubject.next(updated);
      })
    );
  }

  removeItem(cartId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/cart/${cartId}`).pipe(
      tap(() => {
        const filtered = this.cartSubject.value.filter(
          (item) => item.id !== cartId
        );
        this.cartSubject.next(filtered);
      })
    );
  }

  updateQuantity(cartId: string, delta: number): Observable<CartDto> {
    return this.http
      .patch<CartDto>(`${environment.apiUrl}/cart/${cartId}`, { delta })
      .pipe(
        tap((updatedItem) => {
          const updatedList = this.cartSubject.value.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          );
          this.cartSubject.next(updatedList);
        })
      );
  }

  clearCart(userId: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/cart/clear/${userId}`)
      .pipe(tap(() => this.cartSubject.next([])));
  }

  hasItem(bookId: string): boolean {
    return this.cartSubject.value.some((item) => item.bookId === bookId);
  }

  getCartItemsSnapshot(): CartDto[] {
    return this.cartSubject.value;
  }
}
