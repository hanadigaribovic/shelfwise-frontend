import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header-home',
  imports: [
    RouterLink
  ],
  templateUrl: './header-home-page.component.html',
  standalone: true,
  styleUrl: './header-home-page.component.css'
})
export class HeaderHomePageComponent {

}
