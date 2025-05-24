import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  standalone: true,
  imports: [MatIconModule, CommonModule],
})
export class BreadcrumbComponent {
  constructor(public router: Router) {}

  get segments(): string[] {
    return this.router.url.split('?')[0].split('/').filter(Boolean);
  }

  get labelMap(): Record<string, string> {
    return {
      books: 'Books',
      cart: 'Cart',
      wishlist: 'Wishlist',
      order: 'Order Details',
      'new-order': 'Order Status',
      'my-orders': 'My Orders',
    };
  }

  get displaySegments(): { label: string; path: string }[] {
    const paths: { label: string; path: string }[] = [];
    let accumulatedPath = '';

    this.segments.forEach((seg, i) => {
      accumulatedPath += '/' + seg;
      const label = this.labelMap[seg] || decodeURIComponent(seg);
      paths.push({ label, path: accumulatedPath });
    });

    return paths;
  }

  goBack(): void {
    history.back();
  }
}
