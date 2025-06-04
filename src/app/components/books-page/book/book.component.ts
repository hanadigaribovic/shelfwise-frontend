import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Book, BookService } from '../../../services/book.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MatSnackBarModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent {
  book$!: Observable<Book | undefined>;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id')!;
    this.book$ = this.bookService.getBookById(bookId);

    const userId = localStorage.getItem('userId')!;
    this.wishlistService.getWishlist(userId).subscribe();
  }

  addToCart(book: Book) {
    const userId = localStorage.getItem('userId')!;
    this.cartService
      .addItem({
        userId,
        bookId: book.id,
        quantity: 1,
      })
      .subscribe(() => {
        this.snackBar.open('Book added to cart!', 'Close', { duration: 2000 });
      });
  }

  toggleWishlist(book: Book) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.snackBar.open('You must be logged in to manage wishlist.', 'Close', {
        duration: 2000,
      });
      return;
    }

    const existing = this.wishlistService
      .getWishlistSnapshot()
      .find((item) => item.bookId === book.id);

    if (existing) {
      this.wishlistService.removeItem(existing.id!).subscribe(() => {
        this.snackBar.open('Removed from wishlist', 'Close', {
          duration: 2000,
        });
      });
    } else {
      const dto = {
        userId,
        bookId: book.id,
        title: book.title,
        author: book.author,
      };

      this.wishlistService.addItem(dto).subscribe(() => {
        this.snackBar.open('Added to wishlist', 'Close', { duration: 2000 });
      });
    }
  }

  isInWishlist(bookId: string): boolean {
    return this.wishlistService.isInWishlist(bookId);
  }

  isInCart(id: string): boolean {
    return this.cartService.hasItem(id);
  }
}
