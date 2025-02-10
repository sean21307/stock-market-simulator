import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
    if (isPlatformBrowser(this.platformId)) {
      const darkMode = this.isDarkMode();
      this.darkModeSubject.next(darkMode);
      this.updatePageTheme(darkMode);
    }
  }

  private isDarkMode(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  updatePageTheme(darkMode: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle("dark", darkMode);
      this.darkModeSubject.next(darkMode);
    }
  }
}
