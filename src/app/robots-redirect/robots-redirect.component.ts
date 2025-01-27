import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'robots-redirect',
  template: '',
})
export class RobotsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    window.location.href = 'assets/robots.txt';
  }
}