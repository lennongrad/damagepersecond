import { Component, OnInit } from '@angular/core';
import { SkillInfo } from 'src/app/interfaces/skill-information';
import { SelectedSkillService } from 'src/app/services/selected-skill.service';
import { AvailableSkillsService } from 'src/app/services/available-skills.service';
import { SoundInformation } from 'src/app/interfaces/sound-information';
import { SoundEffectPlayerService } from 'src/app/services/sound-effect-player.service';
import * as _ from 'underscore';
import { TooltipService } from 'src/app/services/tooltip.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-skill-selector',
  templateUrl: './skill-selector.component.html',
  styleUrls: ['./skill-selector.component.less']
})
export class SkillSelectorComponent implements OnInit {
  pinnedSkills = Array<SkillInfo>();
  recentlyUsedSkills = Array<SkillInfo>();

  hoveredTooltipSkill?: SkillInfo;
  hoveredElement?: Element;
  hoveredOpacity = 0;

  buttonClickNoise: SoundInformation = {
    audioFilename: "buttonnoise.mp3",
    playbackRateMin: 4,
    playbackRateMax: 8,
    volume: 1,
    concurrentMaximum: 1,
    replacePrevious: true
  }

  bigIconsOn(): boolean{
    return this.settingsService.bigIconsOn;
  }

  getQuickSkills(): Array<SkillInfo> {
    return this.pinnedSkills.concat(this.recentlyUsedSkills);
  }

  selectedSkill?: SkillInfo;
  onClick(event: any, skill: SkillInfo): void {
    if (event.shiftKey) {
      this.onPin(skill);
    } else {
      this.onSelect(skill);
    }

    this.soundEffectPlayer.playSound(this.buttonClickNoise);
  }

  onPin(skill: SkillInfo): void {
    if (_.contains(this.pinnedSkills, skill)) {
      this.pinnedSkills = _.without(this.pinnedSkills, skill);
      this.recentlyUsedSkills.unshift(skill);
    } else {
      this.recentlyUsedSkills = _.without(this.recentlyUsedSkills, skill);
      this.pinnedSkills.push(skill);
    }
  }

  onSelect(skill: SkillInfo): void {
    if (this.selectedSkill == skill) {
      this.selectedSkillService.changeSelectedSkill(undefined);
    } else {
      this.selectedSkillService.changeSelectedSkill(skill);
    }
  }

  skillUsed(skill: SkillInfo): void {
    this.recentlyUsedSkills.sort((x, y) => x.id == skill.id ? -1 : (y.id == skill.id ? 1 : 0));
  }

  keycodeSelect(keycode: number): void {
    var numberSelected = keycode - 49;
    if (numberSelected >= 0 && numberSelected <= 9) {
      this.onSelect(this.getQuickSkills()[numberSelected]);
      this.soundEffectPlayer.playSound(this.buttonClickNoise);
    }
  }

  updateSkills(): void {
    this.recentlyUsedSkills = this.availableSkillsService.getSkills();
  }

  mouseoverSkill(event: any, hoveredSkill: SkillInfo) {
    this.tooltipService.setSkillTooltip(hoveredSkill, event.toElement ? event.toElement : event.target, 1);
  }

  mouseoutSkill(event: any, hoveredSkill: SkillInfo) {
    this.tooltipService.setSkillTooltip(undefined, undefined, 0);
  }

  constructor(
    private selectedSkillService: SelectedSkillService,
    private availableSkillsService: AvailableSkillsService,
    private soundEffectPlayer: SoundEffectPlayerService,
    private tooltipService: TooltipService,
    private settingsService: SettingsService) {

    this.selectedSkillService.selectedSkillChange.subscribe(value => this.selectedSkill = value);
    this.selectedSkillService.skillUsed.subscribe(value => this.skillUsed(value));
    this.selectedSkillService.keycodeSelect.subscribe(value => this.keycodeSelect(value))
  }

  ngOnInit(): void {
    this.updateSkills();
  }

}
