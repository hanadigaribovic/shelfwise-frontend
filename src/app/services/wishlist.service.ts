import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WishlistItem {
  id: string;
  userId: string;
  bookId: string;
  title: string;
  author: string;
  price?: number;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private API_URL = `${environment.apiUrl}/wishlist`;

  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  private currentUserId: string | null = null;

  constructor(private http: HttpClient) {}

  init(userId: string): void {
    this.currentUserId = userId;
    this.refreshWishlist();
  }

  getWishlist(): Observable<WishlistItem[]> {
    return this.wishlistSubject.asObservable();
  }

  private refreshWishlist(): void {
    if (!this.currentUserId) return;
    this.http
      .get<WishlistItem[]>(`${this.API_URL}/${this.currentUserId}`)
      .subscribe((items) => this.wishlistSubject.next(items));
  }

  addItem(dto: { userId: string; bookId: string }): void {
    this.http.post<void>(this.API_URL, dto).subscribe(() => {
      this.refreshWishlist();
    });
  }

  removeItem(wishlistId: string): void {
    console.log('Removing item with ID: ', wishlistId);
    this.http.delete<void>(`${this.API_URL}/${wishlistId}`).subscribe({
      next: () => {
        console.log(`Item with ID ${wishlistId} successfully removed`);
        this.refreshWishlist();
      },
      error: (err) => {
        console.error('Error occurred while deleting item from wishlist', err);
      },
    });
  }

  hasItem(bookId: string): boolean {
    return this.wishlistSubject.value.some((item) => item.bookId === bookId);
  }

  getSnapshot(): WishlistItem[] {
    return this.wishlistSubject.value;
  }

  clear(): void {
    const userId = this.currentUserId;
    if (!userId) return;

    this.http
      .get<WishlistItem[]>(`${this.API_URL}/${userId}`)
      .subscribe((items) => {
        if (items.length === 0) return;

        let completed = 0;
        items.forEach((item) => {
          this.removeItem(item.id);
        });
      });
  }
}
