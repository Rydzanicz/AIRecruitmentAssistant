import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isBrowser: boolean;
  private routerSubscription: Subscription | null = null;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {


    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.routerSubscription?.unsubscribe();
    }
  }

  navigateToBody() {
    this.router.navigate(['/body']);
  }
}
