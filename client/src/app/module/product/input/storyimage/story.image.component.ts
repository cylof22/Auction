import { Component, Input } from '@angular/core';

@Component({
    selector: 'story-image',
    templateUrl: './story.image.component.html',
    styleUrls: ['./story.image.component.css']
})

export class StoryImageComponent {
    @Input() source: string;

    constructor() {
    }
}