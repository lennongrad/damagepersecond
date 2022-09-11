import { Injectable } from '@angular/core';
import { UnitInstance } from '../classes/unit-instance';
import { ItemTooltipComponent } from '../components/tooltips/item-tooltip/item-tooltip.component';
import { SkillTooltipComponent } from '../components/tooltips/skill-tooltip/skill-tooltip.component';
import { TextTooltipComponent } from '../components/tooltips/text-tooltip/text-tooltip.component';
import { UnitTooltipComponent } from '../components/tooltips/unit-tooltip/unit-tooltip.component';
import { Item } from '../interfaces/item-information';
import { SkillInformation } from '../interfaces/skill-information';
import { UnitInformation } from '../interfaces/unit-information';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  skillTooltip?: SkillTooltipComponent;
  setSkillTooltip(skill: SkillInformation | undefined, element: Element | undefined, opacity: number){
    if(this.skillTooltip != undefined){
      this.skillTooltip.hoveredSkill = skill;
      this.skillTooltip.element = element;
      this.skillTooltip.opacity = opacity;
      this.skillTooltip.update();
    }
  }

  unitTooltip?: UnitTooltipComponent;
  setUnitTooltip(unit: UnitInstance | undefined, element: Element | undefined, opacity: number){
    if(this.unitTooltip != undefined){
      this.unitTooltip.hoveredUnit = unit;
      this.unitTooltip.element = element;
      this.unitTooltip.opacity = opacity;
      this.unitTooltip.update();
    }
  }

  textTooltip?: TextTooltipComponent;
  setTextTooltip(text: string, element: Element | undefined, opacity: number){
    if(this.textTooltip != undefined){
      this.textTooltip.text = text;
      this.textTooltip.element = element;
      this.textTooltip.opacity = opacity;
      this.textTooltip.update();
    }
  }

  itemTooltip?: ItemTooltipComponent;
  setItemTooltip(item: Item | undefined, element: Element | undefined, opacity: number){
    if(this.itemTooltip != undefined){
      this.itemTooltip.hoveredItem = item;
      this.itemTooltip.element = element;
      this.itemTooltip.opacity = opacity;
      this.itemTooltip.update();
    }
  }

  constructor() { }
}
