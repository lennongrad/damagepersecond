import { Component, OnInit } from '@angular/core';
import { SkillInformation } from 'src/app/interfaces/skill-information';
import { SelectedSkillService } from 'src/app/services/selected-skill.service';
import { AvailableSkillsService } from 'src/app/services/available-skills.service';
import { SoundInformation } from 'src/app/interfaces/sound-information';
import { SoundEffectPlayerService } from 'src/app/services/sound-effect-player.service';
import * as _ from 'underscore';
import { TooltipService } from 'src/app/services/tooltip.service';
import { PersistentService } from 'src/app/services/persistent.service';
import { SaveService } from 'src/app/services/save.service';

@Component({
  selector: 'app-skill-selector',
  templateUrl: './skill-selector.component.html',
  styleUrls: ['./skill-selector.component.less']
})
export class SkillSelectorComponent implements OnInit {
  pinnedSkills = Array<SkillInformation>();
  recentlyUsedSkills = Array<SkillInformation>();

  hoveredTooltipSkill?: SkillInformation;
  hoveredElement?: Element;
  hoveredOpacity = 0;

  selectedSkill?: SkillInformation;

  buttonClickNoise: SoundInformation = {
    audioFilename: "buttonnoise.mp3",
    playbackRateMin: 4,
    playbackRateMax: 8,
    volume: 1,
    concurrentMaximum: 1,
    replacePrevious: true,
    timeSinceLast: 100
  }

  bigIconsOn(): boolean {
    return this.settingsService.bigIconsOn;
  }

  getQuickSkills(): Array<SkillInformation> {
    return this.pinnedSkills.concat(this.recentlyUsedSkills);
  }

  onClick(event: any, skill: SkillInformation): void {
    if (event.shiftKey) {
      this.onPin(skill);
    } else {
      this.onSelect(skill);
    }

    this.soundEffectPlayer.playSound(this.buttonClickNoise);
  }

  onPin(skill: SkillInformation): void {
    if (_.contains(this.pinnedSkills, skill)) {
      this.pinnedSkills = _.without(this.pinnedSkills, skill);
      this.recentlyUsedSkills.unshift(skill);
    } else {
      this.recentlyUsedSkills = _.without(this.recentlyUsedSkills, skill);
      this.pinnedSkills.push(skill);
    }

    this.saveUsedSkills();
  }

  onSelect(skill: SkillInformation): void {
    if (this.selectedSkill == skill) {
      this.selectedSkillService.changeSelectedSkill(undefined);
    } else {
      this.selectedSkillService.changeSelectedSkill(skill);
    }
  }

  skillUsed(skill: SkillInformation): void {
    if (this.recentlyUsedSkills.includes(skill)) {
      this.recentlyUsedSkills.sort((x, y) => x.id == skill.id ? -1 : (y.id == skill.id ? 1 : 0));
    } else if (!this.pinnedSkills.includes(skill)) {
      this.recentlyUsedSkills.unshift(skill);
      if (this.recentlyUsedSkills.length > 20) {
        this.recentlyUsedSkills.pop();
      }
    }

    this.saveUsedSkills();
  }
  
  saveUsedSkills(): void{
    var pinnedIDs = _.map(this.pinnedSkills, skill => skill.id != undefined ? skill.id : -1);
    var data = JSON.stringify(pinnedIDs)
    this.saveService.saveData("pinned-skills", data);

    var recentIDs = _.map(this.recentlyUsedSkills, skill => skill.id != undefined ? skill.id : -1);
    var data = JSON.stringify(recentIDs)
    this.saveService.saveData("recent-skills", data);
  }

  keycodeSelect(keycode: number): void {
    var numberSelected = keycode - 49;
    if (numberSelected >= 0 && numberSelected <= 9) {
      this.onSelect(this.getQuickSkills()[numberSelected]);
      this.soundEffectPlayer.playSound(this.buttonClickNoise);
    }
  }

  updateSkills(): void {
    var allSkills = this.availableSkillsService.getSkills();

    try {
      var savedPinnedSkills = JSON.parse(this.saveService.getData("pinned-skills")) as Array<string>;
      savedPinnedSkills.forEach((skillID) => {
        if(allSkills[skillID] != undefined){
          this.pinnedSkills.push(allSkills[skillID]);
        }
      })
    } catch { }

    try {
      var recentSkills = JSON.parse(this.saveService.getData("recent-skills")) as Array<string>;
      recentSkills.forEach((skillID) => {
        if(allSkills[skillID] != undefined && !this.pinnedSkills.includes(allSkills[skillID])){
          this.recentlyUsedSkills.push(allSkills[skillID]);
        }
      })
    } catch { }
  }

  mouseoverSkill(event: any, hoveredSkill: SkillInformation) {
    this.tooltipService.setSkillTooltip(hoveredSkill, event.toElement ? event.toElement : event.target, 1);
  }

  mouseoutSkill(event: any, hoveredSkill: SkillInformation) {
    this.tooltipService.setSkillTooltip(undefined, undefined, 0);
  }

  constructor(
    private selectedSkillService: SelectedSkillService,
    private availableSkillsService: AvailableSkillsService,
    private soundEffectPlayer: SoundEffectPlayerService,
    private tooltipService: TooltipService,
    private saveService: SaveService,
    private settingsService: PersistentService) {

    this.selectedSkillService.selectedSkillChange.subscribe(value => this.selectedSkill = value);
    this.selectedSkillService.skillUsed.subscribe(value => this.skillUsed(value));
    this.selectedSkillService.keycodeSelect.subscribe(value => this.keycodeSelect(value))
  }

  ngOnInit(): void {
    this.updateSkills();
  }

}
