import { Component } from '@angular/core';
import { HeaderHomePageComponent } from '../layout/header-home-page/header-home-page.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [HeaderHomePageComponent, FooterComponent, CommonModule, RouterLink],
  templateUrl: './home-page.component.html',
  standalone: true,
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  constructor(private router: Router) {}

  books = [
    { title: 'Atomic Habits', image: '/our-books-1.png' },
    { title: 'The Mountain Is You', image: '/our-books-2.png' },
    { title: 'Red & White Book', image: '/our-books-3.png' },
    { title: 'Ego Is The Enemy', image: '/our-books-4.png' },
  ];

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
