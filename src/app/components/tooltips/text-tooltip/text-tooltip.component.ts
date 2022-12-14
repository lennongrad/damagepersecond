import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TooltipService } from 'src/app/services/tooltip.service';

@Component({
  selector: 'app-text-tooltip',
  templateUrl: './text-tooltip.component.html',
  styleUrls: ['./text-tooltip.component.less']
})
export class TextTooltipComponent implements OnInit {
  @ViewChild('tooltipbox') tooltipBox!: ElementRef;
  @Input() isMain: boolean = false;

  text?: string;
  element?: Element;
  opacity = 1;

  // calculated so that the tooltip is not offscreen
  topOffset = -1000;
  leftOffset = -1000;

  update() {
    if (this.element != undefined && this.tooltipBox != undefined) {
      var elementRect = this.element.getBoundingClientRect();
      this.leftOffset = elementRect.x + elementRect.width;

      if(this.tooltipBox != undefined){
        var tooltipRect = this.tooltipBox.nativeElement.getBoundingClientRect();
        if(this.leftOffset + tooltipRect.width + 75 > document.body.clientWidth){
          this.leftOffset = elementRect.x - tooltipRect.width;
        }
      }

      this.topOffset = elementRect.y + elementRect.height;
    }
  }

  constructor(private tooltipService: TooltipService) {
   }

  ngOnInit(): void {
    if(this.isMain){
      this.tooltipService.textTooltip = this;
    }
  }

}
