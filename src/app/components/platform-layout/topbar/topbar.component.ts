import { Component, OnInit } from '@angular/core';
import { map, of } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
})
export class TopbarComponent implements OnInit {
  cartCount$;
  wishlistCount$;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService
  ) {
    this.cartCount$ = this.cartService
      .getCartItems()
      .pipe(
        map((items) => items.reduce((sum, item) => sum + item.quantity, 0))
      );

    const uid = this.authService.getUserId();
    if (uid) {
      this.wishlistService.init(uid);
      this.wishlistCount$ = this.wishlistService
        .getWishlist()
        .pipe(map((items) => items.length));
    } else {
      this.wishlistCount$ = of(0);
    }
  }

  ngOnInit(): void {}
}
