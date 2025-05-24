import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-book-card',
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css',
  standalone: true,
})
export class BookCardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() author!: string;
  @Input() price!: number;
  @Input() imageUrl!: string;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  addToCart() {
    // ✅ MOCK logic
    if (!this.cartService.hasItem(this.id)) {
      this.cartService.addItem({
        id: this.id,
        title: this.title,
        author: this.author,
        price: this.price,
        quantity: 1,
      });
    } else {
      this.cartService.removeItem(this.id);
    }

    // ✅ HTTP-ready (future)
    /*
    if (!this.isInCart()) {
      this.cartService.addItem({ ... }).subscribe();
    } else {
      this.cartService.removeItem(this.id).subscribe();
    }
    */
  }

  toggleWishlist() {
    if (this.isInWishlist()) {
      this.wishlistService.removeItem(this.id);
    } else {
      this.wishlistService.addItem({
        id: this.id,
        title: this.title,
        author: this.author,
        price: this.price,
      });
    }

    // ✅ HTTP-ready (future)
    /*
    if (this.isInWishlist()) {
      this.wishlistService.removeItem(this.id).subscribe();
    } else {
      this.wishlistService.addItem({...}).subscribe();
    }
    */
  }

  isInCart() {
    return this.cartService.hasItem(this.id); // still works in mock
    // HTTP version would use: return this.cartService.hasItemAsync(this.id)
  }

  isInWishlist() {
    return this.wishlistService.hasItem(this.id);
    // Or reactive: return this.wishlistService.wishlist$.pipe(map(...))
  }
}
