import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-browse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-browse.component.html',
  styleUrls: ['./book-browse.component.css'],
})
export class BookBrowseComponent implements OnInit {
  search = '';
  sort = 'title-asc';

  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.search = params['q'] || '';
      this.sort = params['sort'] || 'title-asc';

      this.bookService.setSearchTerm(this.search);
      this.bookService.setSortOption(this.sort as any);
    });
  }

  onSearchChange(value: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: value },
      queryParamsHandling: 'merge',
    });

    this.bookService.setSearchTerm(value);
  }

  onSortChange(value: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: value },
      queryParamsHandling: 'merge',
    });

    this.bookService.setSortOption(value as any);
  }
}
