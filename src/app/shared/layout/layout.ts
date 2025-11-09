import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout implements OnInit {
  username = 'Pravin';
  role: 'librarian' | 'student' | '' = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.detectRoleFromUrl();

    // Listen for URL changes to update role dynamically
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.detectRoleFromUrl());
  }

  detectRoleFromUrl(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/librarian')) {
      this.role = 'librarian';
    } else if (currentUrl.includes('/student')) {
      this.role = 'student';
    } else {
      this.role = '';
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
