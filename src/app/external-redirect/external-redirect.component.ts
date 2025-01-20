import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-external-redirect',
  template: '',
})
export class ExternalRedirectComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    window.location.href = 'https://www.lib.umich.edu/collections/deep-blue-repositories';
  }
}