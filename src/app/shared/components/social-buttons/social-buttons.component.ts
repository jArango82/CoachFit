import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="social-buttons">
      <button class="social-button" (click)="loginWithFacebook()">
        <svg width="20" height="20" fill="#1877F2" viewBox="0 0 20 20" aria-hidden="true">
          <path fill-rule="evenodd"
            d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
            clip-rule="evenodd"></path>
        </svg>
        Facebook
      </button>
      <button class="social-button" (click)="loginWithGoogle()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
          <path fill="#4285F4"
            d="M24 9.5c3.1 0 5.6 1.1 7.5 2.9l5.6-5.6C33.4 3.2 28.9 1 24 1 14.8 1 7.1 6.6 3.9 14.4l6.7 5.2C12.3 13.3 17.6 9.5 24 9.5z" />
          <path fill="#34A853"
            d="M46.5 24c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3.2-2.4 5.9-5 7.7l7.7 6C43.8 38.2 46.5 31.7 46.5 24z" />
          <path fill="#FBBC05"
            d="M10.6 28.6c-1-3.2-1-6.6 0-9.8L3.9 14.4C1.4 19.2 1.4 24.8 3.9 29.6l6.7-5.2z" />
          <path fill="#EA4335"
            d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.7-6c-2.1 1.4-4.8 2.2-7.8 2.2-6.4 0-11.7-4.8-13.3-11.1l-6.7 5.2C7.1 41.4 14.8 46 24 46z" />
        </svg>
        Google
      </button>
    </div>
  `,
  styleUrls: ['./social-buttons.component.css']
})
export class SocialButtonsComponent {
  loginWithFacebook() {
    console.log('Facebook login clicked');
  }

  loginWithGoogle() {
    console.log('Google login clicked');
  }
}