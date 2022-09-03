import { Component, OnInit } from '@angular/core';
import { getType, SkillInformation } from 'src/app/interfaces/skill-information';
import { SoundInformation } from 'src/app/interfaces/sound-information';
import { SelectedSkillService } from 'src/app/services/selected-skill.service';
import { SoundEffectPlayerService } from 'src/app/services/sound-effect-player.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.less']
})
export class SkillListComponent implements OnInit {
  selectedSkill?: SkillInformation;

  sortBy?: string;
  ascending = true;

  buttonClickNoise: SoundInformation = {
    audioFilename: "buttonnoise.mp3",
    playbackRateMin: 4,
    playbackRateMax: 8,
    volume: 1,
    concurrentMaximum: 1,
    replacePrevious: true,
    timeSinceLast: 100
  }

  selectSort(sortType: string): void{
    if(this.sortBy == sortType){
      this.ascending = !this.ascending;
    } else {
      this.sortBy = sortType;
    }
  }

  getSkills(): Array<SkillInformation>{
    if(this.unitInstanceService.selectedCharacter == undefined){
      return [];
    }

    var baseSkills = this.unitInstanceService.selectedCharacter.availableSkills
    if(this.sortBy != undefined){
      switch(this.sortBy){
        case "name": baseSkills = _.sortBy(baseSkills, 'name'); break;
        case "type": baseSkills = _.sortBy(baseSkills, 'type'); break;
        case "subtype": baseSkills = _.sortBy(baseSkills, (skill) => skill.subtypes != undefined ? skill.subtypes[0] : ""); break;
        case "fp": baseSkills = _.sortBy(baseSkills, (skill) => skill.fpCost != undefined ? skill.fpCost : 0); break;
      }
    }
    return this.ascending ? baseSkills: baseSkills.reverse();
  }

  clickSkill(skill: SkillInformation) : void{
    if (this.selectedSkill == skill) {
      this.selectedSkillService.changeSelectedSkill(undefined);
    } else {
      this.selectedSkillService.changeSelectedSkill(skill);
    }
    this.soundPlayerService.playSound(this.buttonClickNoise);
  }

  mouseoverSkill(event: any, hoveredSkill: SkillInformation): void {
    this.tooltipService.setSkillTooltip(hoveredSkill, event.toElement ? event.toElement.parentElement : event.target.parentElement, 1);
  }

  mouseoutSkill(): void {
    this.tooltipService.setSkillTooltip(undefined, undefined, 0);
  }

  getType(skill: SkillInformation): string{
    return getType(skill);
  }

  constructor(private unitInstanceService: UnitInstancesService,
    private selectedSkillService: SelectedSkillService,
    private tooltipService: TooltipService,
    private soundPlayerService: SoundEffectPlayerService) { }

  ngOnInit(): void {
    this.selectedSkillService.selectedSkillChange.subscribe(value => this.selectedSkill = value);
  }

}
