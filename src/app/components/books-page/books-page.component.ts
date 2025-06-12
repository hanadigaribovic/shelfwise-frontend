import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BookCardComponent } from './book-card/book-card.component';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';

interface Book {
  id: string | number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.css'],
  imports: [BookCardComponent, CommonModule],
  standalone: true,
})
export class BooksPageComponent implements OnInit {
  books$: Observable<Book[]> = of([]);
  private authService: any;
  private cartService: any;

  constructor(private bs: BookService) {}

  ngOnInit(): void {
    this.books$ = this.bs.getFilteredBooks();
  }
}
