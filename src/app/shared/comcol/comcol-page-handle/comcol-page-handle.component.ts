import { Component, Injectable, Input } from '@angular/core';

/**
 * This component builds a URL from the value of "handle"
 */

@Component({
  selector: 'ds-comcol-page-handle',
  styleUrls: ['./comcol-page-handle.component.scss'],
  templateUrl: './comcol-page-handle.component.html'
})

@Injectable()
export class ComcolPageHandleComponent {

  // Optional title
  @Input() title: string;

  // The value of "handle"
  @Input() content: string;

  public getHandle(): string {

    // I had to put this in before I could find where the handle
    // value was coming from.

    const prefix = 'https://hdl.handle.net/';
    const handleIndex = this.content.indexOf('handle');

    if (!this.content.startsWith(prefix) && handleIndex !== -1) {
      this.content = prefix + this.content.substring(handleIndex);
    }
    // Now return the modified content
    return this.content;

  }
}
