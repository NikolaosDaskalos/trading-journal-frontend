import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit, OnDestroy {
  private userSub: Subscription | undefined;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,

    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = Boolean(user);
    });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
