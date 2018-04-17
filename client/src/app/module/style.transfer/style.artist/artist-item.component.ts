import { Component, Input } from '@angular/core';
import { Artist } from '../../artist/artist.model/artist';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'artist-item',
    templateUrl: './artist-item.component.html',
  })

  export class ArtistItemComponent {
    @Input() artist : Artist;

    constructor(private sanitizer: DomSanitizer) {
    }
  }  
