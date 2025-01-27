import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clockss',
  template: '',
})
export class ClockssComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    window.location.href = 'assets/clockss.txt';
  }
}