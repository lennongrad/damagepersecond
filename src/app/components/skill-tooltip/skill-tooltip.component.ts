import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { SkillInfo } from 'src/app/interfaces/skill-information';
import { TooltipService } from 'src/app/services/tooltip.service';

@Component({
  selector: 'app-skill-tooltip',
  templateUrl: './skill-tooltip.component.html',
  styleUrls: ['./skill-tooltip.component.less']
})
export class SkillTooltipComponent implements OnInit {
  @ViewChild('tooltipbox') tooltipBox!: ElementRef;

  hoveredSkill?: SkillInfo;
  element?: Element;
  opacity = 1;

  // calculated so that the tooltip is not offscreen
  topOffset = -1000;
  leftOffset = -1000;

  update() {
    //console.log(this.element, this.tooltipBox)
    if (this.element != undefined && this.tooltipBox != undefined) {
      var elementRect = this.element.getBoundingClientRect();
      this.leftOffset = elementRect.x + elementRect.width;

      if(this.tooltipBox != undefined){
        var tooltipRect = this.tooltipBox.nativeElement.getBoundingClientRect();
        if(this.leftOffset + tooltipRect.width > document.body.clientWidth){
          this.leftOffset = document.body.clientWidth -  tooltipRect.width;
        }
      }

      this.topOffset = elementRect.y + elementRect.height;
    }
  }

  constructor(private tooltipService: TooltipService) { 
    tooltipService.skillTooltip = this;
  }

  ngOnInit(): void {
  }

}
