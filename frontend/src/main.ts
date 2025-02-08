// Import the bootstrapApplication function from Angular's platform-browser package
import { bootstrapApplication } from '@angular/platform-browser'; 

// Import the appConfig object, which contains the configuration for the application (like routing, change detection, etc.)
import { appConfig } from './app/app.config'; 

// Import the AppComponent, which is the root component of the Angular application
import { AppComponent } from './app/app.component'; 

// Bootstraps the application, starting with the AppComponent and using the appConfig for configuration
bootstrapApplication(AppComponent, appConfig)
  // If there's an error during bootstrapping, log it to the console
  .catch((err) => console.error(err));
