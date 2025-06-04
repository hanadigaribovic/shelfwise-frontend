import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WishlistDto, WishlistService } from '../../services/wishlist.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-wishlist-page',
  imports: [CommonModule, MatIconModule],
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.css',
  standalone: true,
})
export class WishlistComponent implements OnInit {
  wishlist$!: Observable<WishlistDto[]>;

  constructor(
    private ws: WishlistService,
    private cs: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.wishlist$ = this.ws.getWishlist(userId);
  }

  remove(id: string) {
    this.ws.removeItem(id).subscribe(() => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.wishlist$ = this.ws.getWishlist(userId); // Refresh
      }
    });
  }

  clear() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.ws.clear(userId).subscribe(() => {
      this.wishlist$ = this.ws.getWishlist(userId); // Refresh
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  addToCart(item: WishlistDto) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.cs
      .addItem({
        userId,
        bookId: item.bookId,
        quantity: 1,
      })
      .subscribe();
  }

  isInCart(bookId: string): boolean {
    return this.cs.hasItem(bookId);
  }
}
