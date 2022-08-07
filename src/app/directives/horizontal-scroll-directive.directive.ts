import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: "[appHorizontalScroll]",
})
export class HorizontalScrollDirective {
  constructor(private element?: ElementRef) {}

  @HostListener("wheel", ["$event"])
  public onScroll(event: WheelEvent) {
    if(this.element != undefined){
      this.element.nativeElement.scrollLeft += event.deltaY;
    }
  }
}