import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WishlistDto {
  id: string; // wishlist item ID
  userId: string;
  bookId: string;
  title: string;
  author: string;
  price: number;
}

export interface AddToWishlistDto {
  userId: string;
  bookId: string;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<WishlistDto[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) {}

  getWishlist(userId: string): Observable<WishlistDto[]> {
    return this.http
      .get<WishlistDto[]>(`${environment.apiUrl}/wishlist/${userId}`)
      .pipe(tap((items) => this.wishlistSubject.next(items)));
  }

  addItem(dto: AddToWishlistDto): Observable<WishlistDto> {
    return this.http
      .post<WishlistDto>(`${environment.apiUrl}/wishlist`, dto)
      .pipe(
        tap((newItem) => {
          const updated = [...this.wishlistSubject.value, newItem];
          this.wishlistSubject.next(updated);
        })
      );
  }

  removeItem(wishlistId: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/wishlist/${wishlistId}`)
      .pipe(
        tap(() => {
          const filtered = this.wishlistSubject.value.filter(
            (item) => item.id !== wishlistId
          );
          this.wishlistSubject.next(filtered);
        })
      );
  }

  clear(userId: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/wishlist/clear/${userId}`)
      .pipe(tap(() => this.wishlistSubject.next([])));
  }

  hasItem(bookId: string): boolean {
    return this.wishlistSubject.value.some((item) => item.bookId === bookId);
  }

  getWishlistSnapshot(): WishlistDto[] {
    return this.wishlistSubject.value;
  }

  isInWishlist(bookId: string): boolean {
    return this.wishlistSubject.value.some((item) => item.bookId === bookId);
  }
}
