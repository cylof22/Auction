import { Directive, ElementRef, Input, ViewContainerRef, OnInit } from '@angular/core';

var Freewall = require("freewall")

@Directive({
	selector: '[appGrid]',
})
export class GridDirective implements OnInit {
  constructor( private viewContainerRef: ViewContainerRef) {
	}
	
	ngOnInit() {
		let id = this.viewContainerRef.element.nativeElement.id;
		alert(id)
		let queryId = "#" + id;
		var wall = new Freewall.freewall(queryId);
		wall.reset({
			selector: '.brick',
			animate: true,
			cellW: 200,
			cellH: 200,
			onResize: function() {
				wall.refresh();
			}
		});
		wall.fitWidth();

		// Todo: how to get the native window
		// for scroll bar appear;
		//$(window).trigger("resize");
	}
}
