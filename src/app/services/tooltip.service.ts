import { Injectable } from '@angular/core';
import { UnitInstance } from '../classes/unit-instance';
import { SkillTooltipComponent } from '../components/skill-tooltip/skill-tooltip.component';
import { UnitTooltipComponent } from '../components/unit-tooltip/unit-tooltip.component';
import { SkillInfo } from '../interfaces/skill-information';
import { UnitInformation } from '../interfaces/unit-information';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  skillTooltip?: SkillTooltipComponent;
  unitTooltip?: UnitTooltipComponent;

  setSkillTooltip(skill: SkillInfo | undefined, element: Element | undefined, opacity: number){
    if(this.skillTooltip != undefined){
      this.skillTooltip.hoveredSkill = skill;
      this.skillTooltip.element = element;
      this.skillTooltip.opacity = opacity;
      this.skillTooltip.update();
    }
  }

  setUnitTooltip(unit: UnitInstance | undefined, element: Element | undefined, opacity: number){
    if(this.unitTooltip != undefined){
      this.unitTooltip.hoveredUnit = unit;
      this.unitTooltip.element = element;
      this.unitTooltip.opacity = opacity;
      this.unitTooltip.update();
    }
  }

  constructor() { }
}
