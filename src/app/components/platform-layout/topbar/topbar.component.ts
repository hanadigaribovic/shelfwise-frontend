import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    private wishlistService: WishlistService
  ) {
    this.cartCount$ = this.cartService
      .getCartItems()
      .pipe(map((items) => items.length));
    this.wishlistCount$ = this.wishlistService
      .getWishlist()
      .pipe(map((items) => items.length));
  }

  ngOnInit(): void {}
}
