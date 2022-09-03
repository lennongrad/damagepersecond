import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, HostListener } from '@angular/core';
import { getType, SkillInformation, SkillSubtype } from 'src/app/interfaces/skill-information';
import { StatusType } from 'src/app/interfaces/status-information';
import { TooltipService } from 'src/app/services/tooltip.service';

@Component({
  selector: 'app-skill-tooltip',
  templateUrl: './skill-tooltip.component.html',
  styleUrls: ['./skill-tooltip.component.less']
})
export class SkillTooltipComponent implements OnInit {
  @ViewChild('tooltipbox') tooltipBox!: ElementRef;

  hoveredSkill?: SkillInformation;
  element?: Element;
  opacity = 1;

  pressedKeys: { [keycode: string]: boolean } = {};
  @HostListener('window:keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) { this.pressedKeys[event.key] = true }
  @HostListener('document:keyup', ['$event'])
  onKeyDown(event: KeyboardEvent) { this.pressedKeys[event.key] = false; }

  readonly StatusType = StatusType;

  // calculated so that the tooltip is not offscreen
  topOffset = -1000;
  leftOffset = -1000;

  update() {
    if (this.element != undefined && this.tooltipBox != undefined) {
      var elementRect = this.element.getBoundingClientRect();
      this.leftOffset = elementRect.x + elementRect.width;

      if(this.tooltipBox != undefined){
        var tooltipRect = this.tooltipBox.nativeElement.getBoundingClientRect();
        if(this.leftOffset + tooltipRect.width > document.body.clientWidth){
          this.leftOffset = document.body.clientWidth -  tooltipRect.width - 8;
        }
      }

      this.topOffset = elementRect.y + elementRect.height;
    }
  }

  getDescription(): string{
    if(this.hoveredSkill == undefined)
    {
      return "";
    }
    
    if(typeof this.hoveredSkill.description === 'string'){
      return this.hoveredSkill.description;
    } else {
      return this.hoveredSkill.description();
    }
  }
  
  getType(): string{
    if(this.hoveredSkill != undefined){
      return getType(this.hoveredSkill);
    }
    return "";
  }

  constructor(private tooltipService: TooltipService) { 
    tooltipService.skillTooltip = this;
  }

  ngOnInit(): void {
  }

}
