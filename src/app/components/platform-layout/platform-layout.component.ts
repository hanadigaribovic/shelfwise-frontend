import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { BookBrowseComponent } from './book-browse/book-browse.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-platform-layout',
  imports: [
    SidebarComponent,
    TopbarComponent,
    BookBrowseComponent,
    RouterModule,
    CommonModule,
    MatIconModule,
    BreadcrumbComponent,
  ],
  templateUrl: './platform-layout.component.html',
  styleUrl: './platform-layout.component.css',
  standalone: true,
})
export class PlatformLayoutComponent {
  constructor(public router: Router) {}

  get currentUrl(): string {
    return this.router.url;
  }

  get lastSegment(): string {
    return this.currentUrl.split('/').pop()!;
  }

  get currentSection(): string {
    const segments = this.currentUrl.split('/');
    return segments.length > 1 ? segments[1] : '';
  }

  showBreadcrumb(): boolean {
    const sectionsWithBreadcrumb = [
      'books',
      'cart',
      'wishlist',
      'order',
      'new-order',
    ];
    return (
      sectionsWithBreadcrumb.includes(this.currentSection) &&
      this.currentUrl.split('/').length >= 2
    );
  }

  navigateBack(): void {
    if (this.currentSection === 'books') this.router.navigate(['/books']);
    else if (this.currentSection === 'cart') this.router.navigate(['/books']);
    else if (this.currentSection === 'wishlist')
      this.router.navigate(['/books']);
    else if (this.currentSection === 'order') {
      if (this.currentUrl.includes('new-order')) {
        this.router.navigate(['/my-orders']);
      } else {
        this.router.navigate(['/cart']);
      }
    } else if (this.currentSection === 'new-order')
      this.router.navigate(['/my-orders']);
  }
}
