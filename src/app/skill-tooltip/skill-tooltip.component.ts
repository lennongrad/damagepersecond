import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Skill } from '../skill';

@Component({
  selector: 'app-skill-tooltip',
  templateUrl: './skill-tooltip.component.html',
  styleUrls: ['./skill-tooltip.component.less']
})
export class SkillTooltipComponent implements OnInit {
  @ViewChild('tooltipbox') tooltipBox!: ElementRef;

  @Input() hoveredSkill?: Skill;
  @Input() element?: Element;
  @Input() opacity = 1;

  // calculated so that the tooltip is not offscreen
  topOffset = -1000;
  leftOffset = -1000;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
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

}
