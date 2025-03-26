import { Injectable, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetricsService implements OnDestroy {
  private intervalSubscription?: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Start collecting metrics only if in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.startPeriodicMetricsCollection();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  public collectAndSendMetrics(): void {
    const metrics = this.collectPerformanceMetrics();
    if (metrics) {
      this.sendMetricsToBackend(metrics);
    }
  }

  private collectPerformanceMetrics(): any {
    if (isPlatformBrowser(this.platformId)) {
      return {
        loadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
        domContentLoaded: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart,
        // Add more metrics as needed
      };
    }
    return null;
  }

  private sendMetricsToBackend(metrics: any): void {
    fetch('http://metrics-service:3000/metrics', {  // Use the appropriate service endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metrics),
    }).catch((error) => console.error('Error sending metrics:', error));
  }

  private startPeriodicMetricsCollection(): void {
    // Use an interval to periodically collect metrics (e.g., every minute)
    this.intervalSubscription = interval(60000).subscribe(() => {
      this.collectAndSendMetrics();
    });
  }
}