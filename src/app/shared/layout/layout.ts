import { Component, HostListener, OnInit } from '@angular/core';
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
  username = localStorage.getItem('username') || '';
  role: 'librarian' | 'student' | '' = '';
  baseRoute = '';
   scrollWidth = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserInfo();
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadUserInfo());
  }
  
  loadUserInfo(): void {
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');
    const studentIdStr = localStorage.getItem('token');
    if (!studentIdStr || !storedRole) {
      //alert('No logged in. Please login first.');
      this.router.navigate(['/login']);

      return;
    }else if(storedRole=='student'){
      this.baseRoute=this.role=='student' ? '/student' : '';
    }else if(storedRole=='librarian'){
      this.baseRoute=this.role=='librarian' ? '/librarian' : '';
    }

    this.role = storedRole === 'librarian' || storedRole === 'student' ? storedRole : '';
    this.username = storedUsername || '';

    this.baseRoute = this.role === 'librarian' ? '/librarian' :
                     this.role === 'student' ? '/student' : '';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    this.scrollWidth = (winScroll / height) * 100; 
  }
}
