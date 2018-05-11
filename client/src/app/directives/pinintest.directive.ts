import { Directive, ElementRef, Input, ViewContainerRef, OnInit } from '@angular/core';

var Freewall = require("freewall")

@Directive({
  selector: '[appPinintest]'
})
export class PinintestDirective {

  constructor( private viewContainerRef: ViewContainerRef) { 
    let id = this.viewContainerRef.element.nativeElement.selector;
    let queryId = "#" + id;

    var wall = new Freewall(queryId);
			wall.reset({
				selector: '.brick',
				animate: true,
				cellW: 200,
				cellH: 'auto',
				onResize: function() {
					wall.fitWidth();
				}
			});

			wall.container.find('.brick img').load(function() {
				wall.fitWidth();
			});
  }
}
