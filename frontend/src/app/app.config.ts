// Import necessary modules and functions from Angular packages
import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core'; 
import { provideRouter } from '@angular/router';  // Provides routing services for the app
import { provideHttpClient } from '@angular/common/http'; // Provides the HTTP client for making API requests
import { provideClientHydration } from '@angular/platform-browser'; // Helps with server-side rendering (SSR) hydration
import { CommonModule } from '@angular/common'; // ✅ Import this to enable commonly used Angular features like pipes and directives

// Import the application's routes
import { routes } from './app.routes'; // Contains the route configuration for the application

// Define the appConfig object, which holds the configuration for the application
export const appConfig: ApplicationConfig = {
  providers: [
    // Enable Zone.js change detection with event coalescing for better performance
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    // Set up routing for the app using the imported routes configuration
    provideRouter(routes), 
    
    // Enable client-side hydration for SSR apps to improve performance on the client after server rendering
    provideClientHydration(), 
    
    // Provide the HttpClient module to handle HTTP requests across the app
    provideHttpClient(),
    
    // Import CommonModule, which makes commonly used features like ngIf, ngFor, and pipes available in the application
    importProvidersFrom(CommonModule) // This imports common Angular directives, pipes, and services
  ],
};