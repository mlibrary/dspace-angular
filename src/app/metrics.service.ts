import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetricsService implements OnDestroy {
  private intervalSubscription?: Subscription;

  constructor() {
    // Optionally, start collecting metrics on construction
    this.startPeriodicMetricsCollection();
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  // Make the method public
  public collectAndSendMetrics(): void {
    const metrics = this.collectPerformanceMetrics();
    this.sendMetricsToBackend(metrics);
  }

  private collectPerformanceMetrics(): any {
    return {
      loadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
      domContentLoaded: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart,
      // Add more metrics as needed
    };
  }

  private sendMetricsToBackend(metrics: any): void {
    fetch('https://localhost:3000/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metrics),
    }).catch((error) => console.error('Error sending metrics:', error));
  }

  private startPeriodicMetricsCollection(): void {
    // For periodic collection (e.g., every minute)
    this.intervalSubscription = interval(60000).subscribe(() => {
      this.collectAndSendMetrics();
    });
  }
}