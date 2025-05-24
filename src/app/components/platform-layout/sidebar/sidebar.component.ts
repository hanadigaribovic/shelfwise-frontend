import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  selectedCategory = '';
  availableOnly = false;

  categories = ['Self-help', 'Fiction', 'Non-fiction', 'Science', 'Fantasy'];

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.minPrice = params['min'] ? +params['min'] : undefined;
      this.maxPrice = params['max'] ? +params['max'] : undefined;
      this.minRating = params['rating'] ? +params['rating'] : undefined;
      this.selectedCategory = params['cat'] || '';
      this.availableOnly = params['avail'] === 'true';

      this.applyFilters(false); // apply without pushing new URL again
    });
  }

  applyFilters(pushToUrl = true) {
    const filterParams: any = {
      ...(this.minPrice != null && { min: this.minPrice }),
      ...(this.maxPrice != null && { max: this.maxPrice }),
      ...(this.minRating != null && { rating: this.minRating }),
      ...(this.selectedCategory && { cat: this.selectedCategory }),
      ...(this.availableOnly && { avail: true }),
    };

    if (pushToUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: filterParams,
        queryParamsHandling: 'merge',
      });
    }

    this.bookService.setFilterOptions({
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minRating: this.minRating,
      category: this.selectedCategory || undefined,
      availableOnly: this.availableOnly,
    });
  }

  clearFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });

    this.minPrice = this.maxPrice = this.minRating = undefined;
    this.selectedCategory = '';
    this.availableOnly = false;

    this.applyFilters(false);
  }
}
