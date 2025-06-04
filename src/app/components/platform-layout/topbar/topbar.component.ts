import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
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
  cartCount$!: Observable<number>;
  wishlistCount$!: Observable<number>;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId')!; // sigurno postoji

    this.cartCount$ = this.cartService
      .getCartItems(userId)
      .pipe(map((items) => items.length));

    this.wishlistCount$ = this.wishlistService
      .getWishlist(userId)
      .pipe(map((items) => items.length));
  }
}
