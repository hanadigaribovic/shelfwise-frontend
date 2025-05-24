import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WishlistItem, WishlistService } from '../../services/wishlist.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-wishlist-page',
  imports: [CommonModule, MatIconModule],
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.css',
})
export class WishlistComponent implements OnInit {
  wishlist$!: Observable<WishlistItem[]>;

  constructor(
    private ws: WishlistService,
    private cs: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wishlist$ = this.ws.getWishlist();

    // ✅ Uncomment this if `getWishlist()` becomes non-subject-based HTTP:
    // this.ws.getWishlist().subscribe(items => {
    //   this.wishlist = items;
    // });
  }

  remove(id: string) {
    this.ws.removeItem(id);

    // ✅ Future backend version (returns Observable):
    // this.ws.removeItem(id).subscribe();
  }

  clear() {
    this.ws.clear();

    // ✅ Future backend version:
    // this.ws.clear().subscribe();
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  addToCart(item: WishlistItem) {
    this.cs.addItem({
      id: item.id,
      title: item.title,
      author: item.author,
      quantity: 1,
      price: item.price,
    });

    // ✅ Future backend version:
    // this.cs.addItem({...}).subscribe();
  }

  isInCart(id: string): boolean {
    return this.cs.hasItem(id);

    // ✅ Optional server-side check in future:
    // return false; // backend variant should be handled async
  }
}
