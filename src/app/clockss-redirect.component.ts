import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'clockss-redirect',
  template: '',
})
export class ClockssComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    window.location.href = 'https://www.lib.umich.edu/collections/deep-blue-repositories';
  }
}