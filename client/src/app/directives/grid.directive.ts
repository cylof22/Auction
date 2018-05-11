import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
var Freewall = require("freewall")

@Directive({
  selector: '[appGrid]'
})
export class GridDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
    let id = this.viewContainerRef.element.nativeElement.selector;
    let queryId = "#" + id;

    var temp = "<div class='cell' style='width:{width}px; height: {height}px; background-image: url(i/photo/{index}.jpg)'></div>";
			var w = 200, h = 200, html = '', limitItem = 49;
			for (var i = 0; i < limitItem; ++i) {
				html += temp.replace(/\{height\}/g, h.toString()).replace(/\{width\}/g, w.toString()).replace("{index}", (i + 1).toString());
			}
			$(queryId).html(html);

			var wall = new Freewall(queryId);
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
			// for scroll bar appear;
      $(window).trigger("resize");
  }
}
