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

    var temp = "<div class='cell' style='width:{width}px; height: {height}px; background-image: url(i/photo/{index}.jpg)'></div>";
		var w = 200, h = 200, html = '', limitItem = 49;
		for (var i = 0; i < limitItem; ++i) {
			html += temp.replace(/\{height\}/g, h.toString()).replace(/\{width\}/g, w.toString()).replace("{index}", (i + 1).toString());
		}

		this.viewContainerRef.element.nativeElement.html(html);
		var wall = new Freewall.freewall(queryId);
		wall.reset({
			selector: '.cell',
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
