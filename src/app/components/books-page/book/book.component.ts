import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Book, BookService } from '../../../services/book.service';
import { CartService } from '../../../services/cart.service';
import {
  WishlistItem,
  WishlistService,
} from '../../../services/wishlist.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent {
  bookId!: string;
  book$!: Observable<Book | undefined>;
  wishlist$!: Observable<WishlistItem[]>;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    protected wishlistService: WishlistService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id')!;
    this.book$ = this.bookService.getBookById(this.bookId);

    const uid = this.authService.getUserId();
    if (uid) {
      this.wishlistService.init(uid);
      this.wishlist$ = this.wishlistService.getWishlist();
    }
  }

  addToCart(book: Book) {
    this.cartService.addItem({
      userId: this.authService.getUserId()!, // zamijeni s metodom kojom dohvaćaš usera
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: 1,
    });
  }

  toggleWishlist(book: Book) {
    const uid = this.authService.getUserId();
    if (!uid) return;

    const wishlist = this.wishlistService.getSnapshot();
    const exists = this.wishlistService.hasItem(book.id);

    if (exists) {
      const item = wishlist.find((w) => w.bookId === book.id);
      if (item) {
        this.wishlistService.removeItem(item.id);
      }
    } else {
      this.wishlistService.addItem({ userId: uid, bookId: book.id });
    }
  }

  isInCart(bookId: string): boolean {
    return this.cartService.hasItem(bookId);
  }
}
