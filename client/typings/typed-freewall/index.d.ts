// Type definitions for Freewall 1.0.6
// Project: http://vnjs.net/www/project/freewall/

interface FreewallGridOptions {

    /**
     * True: to make block can be drag & drop. Default: false
     */
    draggable?: boolean;

    /**
     * True: to make block move with animation
     */
    animate?: boolean;

    /**
     * The width of unit, base on it will build grid container. It can be a function and return value.  Default: 100
     *
     * Example:
     *  var wall = new Freewall('.free-wall');
     *  wall.reset({
     *   selector: '.brick',
     *   cellW: function(width) {
     *       var cellWidth = width / 3;
     *       return cellWidth - 20;
     *       },
     *   cellH: 160
     *   });
     */
    cellW?: number | Function;

    /**
     * The height of unit, base on it will build grid container. It can be a function and return value. Default: 100
     */
    cellH?: number | Function;

    /**
     * The time delay for show block. It will increase by each block. Default: 0
     */
    delay?: number;

    /**
     *  value is null or not set let blocks can adjust and resize to fill gap. Default: null
     *
     * value is 0 or false let blocks can adjust size but can't resize to fill gap.
     * value is 1 or true let blocks keep the size as init, can't resize to fill gap.
     * Can override the fixSize option by set data-fixSize attribute in the block.
     *
     *  Example
     *   <div class="brick size22" data-fixSize=true>
     *   <div class='cover'>
     *   <div class="item size12"></div>
     *   <div class="item size12"></div>
     *   </div>
     *   </div>
     */
    fixSize?: boolean;

    /**
     *  The horizon spacing between the column. Default is number, but can set it with 'auto' value. Default: 10
     */
    gutterX?: number | string;

    /**
     *  The vertical spacing between the row. Default is number, but can set it with 'auto' value. Default: 10
     */
    gutterY?: number | string;

    /**
     *  Get all blocks for the layout
     */
    selector?: string;

    /**
     *  True: will caches the with and height of block for next time. Default: true
     */
    cacheSize?: boolean;

    /**
     *  Keep the order as same as HTML structure
     */
    keepOrder?: boolean;

    /**
     *  True: let layout start render from right to left. Default: false
     */
    rightToLeft?: boolean;

    /**
     *  True: let layout start render from bottom up to top. Default: false
     */
    bottomToTop?: boolean;

    /**
     *  Registry callback when a gap found.
     */
    onGapFound?: Function;

    /**
     *   Registry callback when all block arrange.
     */
    onComplete?: Function;

    /**
     *  Registry callback when browser resize.
     */
    onResize?: Function;

    /**
     *  Fire when block adjusted.
     */
    onBlockReady?: Function;

    /**
     *  Fire before block show or hide in the layout.
     */
    onBlockActive?: Function;

    /**
     *  Fire when block finish show or hide in the layout.
     */
    onBlockFinish?: Function;

    /**
     *  Fire when block changes the size to fills a gap.
     */
    onBlockResize?: Function;

    /**
     *  Fire when block moves by dragging.
     */
    onBlockMove?: Function;
}

interface Freewall {

    /**
     *  Support create custom event when arrange layout
     */
    addCustomEvent(name: string, callback: Function): void;

    /**
     *  Append one or more items into layout
     */
    appendBlock(items: JQuery|HTMLElement): void;

    /**
     *  Add one or more blank area into layout
     */
    appendHoles(holes: any): void;

    /**
     *  Let layout without gaps
     */
    fillHoles(): void;

    /**
     *  Fillter blocks to show
     */
    filter(selector: string): any;

    /**
     *  Fire custom event
     */
    fireEvent(): any;

    /**
     *  Made the layout fit with limit height
     */
    fitHeight(height?: number): void;

    /**
     *  Made the layout fit with limit width
     */
    fitWidth(width?: number): void;

    /**
     *  Made the layout fit with limit width and height
     */
    fitZone(width: number, height: number): void;

    /**
     *  Set a block at fixed position, top/left is multiple of cell with/height
     */
    fixPos(object: any): void;

    /**
     *  Set a block with special width or height
     */
    fixSize(object: any): void;

    /**
     *  Prepend one or more items into layout
     */
    prepend(items: JQuery | HTMLElement): void;

    /**
     *  Rearrange layout
     */
    refresh(): void;

    /**
     *  Reset the whole freewall with new options
     */
    reset(options: FreewallGridOptions): void;

    /**
     *  Set the holes on layout
     */
    setHoles(hole: any): void;

    /**
     *  Sort the Bricks
     *  Example:
     *  wall.sortBy(function(itemA: Element, itemB: Element) {
     *      return $(itemB).width() - $(itemA).width();
     *  });
     */
     sortBy(func: Function): Freewall;

    /**
     *  Made all block to show
     */
    unFilter(): void;
}

interface FreewallStatic {
    new(selector: string): Freewall;
}

declare module "freewall" {
    export = freewall;
}

declare var freewall: FreewallStatic;
