import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WishlistItem, WishlistService } from '../../services/wishlist.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.css',
})
export class WishlistComponent implements OnInit {
  wishlist$!: Observable<WishlistItem[]>;

  constructor(
    private ws: WishlistService,
    private cs: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const uid = this.auth.getUserId();
    if (uid) {
      this.ws.init(uid);
      this.wishlist$ = this.ws.getWishlist();
    }
  }

  remove(item: WishlistItem) {
    this.ws.removeItem(item.id);
  }

  clear() {
    this.ws.clear();
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  addToCart(item: WishlistItem) {
    this.cs.addItem({
      userId: this.auth.getUserId()!,
      bookId: item.bookId,
      title: item.title,
      author: item.author,
      price: item.price ?? 0,
      quantity: 1,
    });
  }

  isInCart(bookId: string): boolean {
    return this.cs.hasItem(bookId);
  }
}
