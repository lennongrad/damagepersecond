import { Component, Input, OnInit, Output } from '@angular/core';
import { SkillInfo } from 'src/app/interfaces/skill-information';
import { SelectedSkillService } from 'src/app/services/selected-skill.service';
import { AvailableSkillsService } from 'src/app/services/available-skills.service';
import { SoundInfo } from 'src/app/interfaces/soundinfo';
import { SoundEffectPlayerService } from 'src/app/services/sound-effect-player.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SkillSelectorPopupComponent } from './skill-selector-popup/skill-selector-popup.component';
import * as _ from 'underscore';
import { TooltipService } from 'src/app/services/tooltip.service';

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

  buttonClickNoise: SoundInfo = {
    audioFilename: "buttonnoise.mp3",
    playbackRateMin: 4,
    playbackRateMax: 8,
    volume: 1,
    concurrentMaximum: 1,
    replacePrevious: true
  }

  getQuickSkills() {
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

  openPopup(){
    var dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "dialog-panel";
    dialogConfig.backdropClass = "dialog-backdrop";
    dialogConfig.data = { };

    const dialogRef = this.dialogService.open(SkillSelectorPopupComponent, dialogConfig);
    //dialogRef.afterClosed().subscribe(data => console.log(data));
  }

  updateSkills(): void {
    this.recentlyUsedSkills = this.availableSkillsService.getSkills();
  }

  mouseoverSkill(event: any, hoveredSkill: SkillInfo) {
    this.tooltipService.setSkillTooltip(hoveredSkill, event.toElement ? event.toElement : event.target, .9);
  }

  mouseoutSkill(event: any, hoveredSkill: SkillInfo) {
    this.tooltipService.setSkillTooltip(undefined, undefined, 0);
  }

  constructor(
    private selectedSkillService: SelectedSkillService,
    private availableSkillsService: AvailableSkillsService,
    private soundEffectPlayer: SoundEffectPlayerService,
    private dialogService: MatDialog,
    private tooltipService: TooltipService) {

    this.selectedSkillService.selectedSkillChange.subscribe(value => this.selectedSkill = value);
    this.selectedSkillService.skillUsed.subscribe(value => this.skillUsed(value));
    this.selectedSkillService.keycodeSelect.subscribe(value => this.keycodeSelect(value))
  }

  ngOnInit(): void {
    this.updateSkills();
  }

}
