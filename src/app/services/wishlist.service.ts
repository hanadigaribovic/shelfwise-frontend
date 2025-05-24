import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
// import { HttpClient } from '@angular/common/http'; // ✅ Uncomment when backend is used

export interface WishlistItem {
  id: string;
  title: string;
  author: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([
    {
      id: '1',
      title: 'Story about John Doe',
      author: 'John Doe',
      price: 12.0,
    },
    {
      id: '2',
      title: 'Story about John Doe',
      author: 'John Doe',
      price: 12.0,
    },
    {
      id: '3',
      title: 'Story about John Doe',
      author: 'John Doe',
      price: 12.0,
    },
  ]);

  // constructor(private http: HttpClient) {} // ✅ Use when switching to real backend
  constructor() {} // 👈 mock version

  getWishlist(): Observable<WishlistItem[]> {
    return this.wishlistSubject.asObservable();

    // ✅ Future backend call
    // return this.http.get<WishlistItem[]>('/api/wishlist');
  }

  addItem(item: WishlistItem) {
    const exists = this.wishlistSubject.value.some((i) => i.id === item.id);
    if (!exists) {
      this.wishlistSubject.next([...this.wishlistSubject.value, item]);
    }

    // ✅ Future backend call
    // return this.http.post<void>('/api/wishlist', item);
  }

  removeItem(id: string) {
    const items = this.wishlistSubject.value.filter((i) => i.id !== id);
    this.wishlistSubject.next(items);

    // ✅ Future backend call
    // return this.http.delete<void>(`/api/wishlist/${id}`);
  }

  clear() {
    this.wishlistSubject.next([]);

    // ✅ Future backend call
    // return this.http.delete<void>('/api/wishlist');
  }

  hasItem(id: string): boolean {
    return this.wishlistSubject.value.some((item) => item.id === id);

    // ✅ Optional: implement backend verification if needed
    // return this.getWishlist().pipe(map(items => items.some(i => i.id === id)));
  }
}
