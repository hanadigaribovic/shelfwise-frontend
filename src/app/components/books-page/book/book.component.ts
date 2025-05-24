import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Book, BookService } from '../../../services/book.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-book',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent {
  book$!: Observable<Book | undefined>; // ✅ mock & HTTP both work here

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id')!;
    this.book$ = this.bookService.getBookById(bookId); // ✅ mock or backend
  }

  addToCart(book: Book) {
    // ✅ MOCK
    if (!this.cartService.hasItem(book.id)) {
      this.cartService.addItem({ ...book, quantity: 1 });
    }

    // ✅ HTTP-ready version
    /*
    this.cartService.addItem({ ...book, quantity: 1 }).subscribe();
    */
  }

  toggleWishlist(book: Book) {
    // ✅ MOCK
    if (this.wishlistService.hasItem(book.id)) {
      this.wishlistService.removeItem(book.id);
    } else {
      this.wishlistService.addItem(book);
    }

    // ✅ HTTP-ready version
    /*
    if (this.isInWishlist(book.id)) {
      this.wishlistService.removeItem(book.id).subscribe();
    } else {
      this.wishlistService.addItem(book).subscribe();
    }
    */
  }

  isInCart(id: string) {
    return this.cartService.hasItem(id);

    // ✅ HTTP-ready version:
    // return this.cartService.cartItems$.pipe(map(items => items.some(i => i.id === id)));
  }

  isInWishlist(id: string) {
    return this.wishlistService.hasItem(id);
  }
}
