import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import {
  WishlistItem,
  WishlistService,
} from '../../../services/wishlist.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css',
})
export class BookCardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() author!: string;
  @Input() price!: number;
  @Input() imageUrl!: string;
  wishlist$!: Observable<WishlistItem[]>;

  constructor(
    private cartService: CartService,
    protected wishlistService: WishlistService,
    private authService: AuthService
  ) {}

  addToCart() {
    if (this.isInCart()) {
      // If item is in cart, find it and remove it
      const cartItems = this.cartService.getSnapshot();
      const cartItem = cartItems.find((item) => item.bookId === this.id);
      if (cartItem?.cartId) {
        this.cartService.removeItem(
          cartItem.cartId,
          this.authService.getUserId()!
        );
      }
    } else {
      // If item is not in cart, add it
      this.cartService.addItem({
        userId: this.authService.getUserId()!,
        bookId: this.id,
        title: this.title,
        author: this.author,
        price: this.price,
        quantity: 1,
      });
    }
  }

  toggleWishlist() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const wishlist = this.wishlistService.getSnapshot();
    const exists = this.wishlistService.hasItem(this.id);

    if (exists) {
      const item = wishlist.find((i) => i.bookId === this.id);
      if (item) this.wishlistService.removeItem(item.id);
      console.log();
    } else {
      this.wishlistService.addItem({ userId, bookId: this.id });
    }
  }

  isInCart() {
    return this.cartService.hasItem(this.id);
  }

  ngOnInit(): void {
    const uid = this.authService.getUserId();
    if (uid) {
      this.wishlist$ = this.wishlistService.getWishlist();
    }
  }
}
