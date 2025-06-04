import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { WishlistService } from '../../../services/wishlist.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule, MatSnackBarModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css',
})
export class BookCardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() author!: string;
  @Input() price!: number;
  @Input() imageUrl: string = 'assets/images/our-books-4.png';

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {}

  addToCart() {
    const userId = localStorage.getItem('userId')!;
    const isInCart = this.cartService
      .getCartItemsSnapshot()
      .some((item) => item.bookId === this.id);

    if (!isInCart) {
      this.cartService
        .addItem({
          userId,
          bookId: this.id,
          quantity: 1,
        })
        .subscribe(() => {
          this.snackBar.open('Added to cart', 'Close', { duration: 2000 });
        });
    } else {
      const cartItem = this.cartService
        .getCartItemsSnapshot()
        .find((item) => item.bookId === this.id);

      if (cartItem) {
        this.cartService.removeItem(cartItem.id).subscribe(() => {
          this.snackBar.open('Removed from cart', 'Close', { duration: 2000 });
        });
      }
    }
  }

  toggleWishlist() {
    const userId = localStorage.getItem('userId')!;
    const existing = this.wishlistService
      .getWishlistSnapshot()
      .find((item) => item.bookId === this.id);

    if (existing && existing.id) {
      this.wishlistService.removeItem(existing.id).subscribe(() => {
        this.snackBar.open('Removed from wishlist', 'Close', {
          duration: 2000,
        });
      });
    } else {
      this.wishlistService
        .addItem({
          userId,
          bookId: this.id,
        })
        .subscribe(() => {
          this.snackBar.open('Added to wishlist', 'Close', { duration: 2000 });
        });
    }
  }

  isInCart(): boolean {
    return this.cartService
      .getCartItemsSnapshot()
      .some((item) => item.bookId === this.id);
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.id);
  }
}
