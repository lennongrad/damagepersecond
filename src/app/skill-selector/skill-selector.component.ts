import { Component, Input, OnInit, Output } from '@angular/core';
import { Skill } from '../skill';
import { EventEmitter } from '@angular/core';
import { SelectedSkillService } from '../selected-skill.service';
import { AvailableSkillsService } from '../available-skills.service';
import { SoundInfo } from '../soundinfo';
import { SoundEffectPlayerService } from '../sound-effect-player.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as _ from 'underscore';
import { SkillSelectorPopupComponent } from './skill-selector-popup/skill-selector-popup.component';

@Component({
  selector: 'app-skill-selector',
  templateUrl: './skill-selector.component.html',
  styleUrls: ['./skill-selector.component.less']
})
export class SkillSelectorComponent implements OnInit {
  pinnedSkills = Array<Skill>();
  recentlyUsedSkills = Array<Skill>();

  hoveredTooltipSkill?: Skill;
  hoveredElement?: Element;
  hoveredOpacity = 0;

  buttonClickNoise: SoundInfo = {
    audioFilename: "../assets/buttonnoise.mp3",
    playbackRateMin: 4,
    playbackRateMax: 8,
    volume: 1,
    concurrentMaximum: 1,
    replacePrevious: true
  }

  getQuickSkills() {
    return this.pinnedSkills.concat(this.recentlyUsedSkills);
  }

  selectedSkill?: Skill;
  onClick(event: any, skill: Skill): void {
    if (event.shiftKey) {
      this.onPin(skill);
    } else {
      this.onSelect(skill);
    }

    this.soundEffectPlayer.playSound(this.buttonClickNoise);
  }

  onPin(skill: Skill): void {
    if (_.contains(this.pinnedSkills, skill)) {
      this.pinnedSkills = _.without(this.pinnedSkills, skill);
      this.recentlyUsedSkills.unshift(skill);
    } else {
      this.recentlyUsedSkills = _.without(this.recentlyUsedSkills, skill);
      this.pinnedSkills.push(skill);
    }
  }

  onSelect(skill: Skill): void {
    if (this.selectedSkill == skill) {
      this.selectedSkillService.changeSelectedSkill(undefined);
    } else {
      this.selectedSkillService.changeSelectedSkill(skill);
    }
  }

  skillUsed(skill: Skill): void {
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

  mouseoverSlot(event: any, hoveredSkill: Skill) {
    this.hoveredTooltipSkill = hoveredSkill;
    this.hoveredElement = event.toElement;
    this.hoveredOpacity = .9;
  }

  mouseoutSlot(event: any, hoveredSkill: Skill) {
    this.hoveredOpacity = 0;
  }

  constructor(
    private selectedSkillService: SelectedSkillService,
    private availableSkillsService: AvailableSkillsService,
    private soundEffectPlayer: SoundEffectPlayerService,
    private dialogService: MatDialog) {

    this.selectedSkillService.selectedSkillChange.subscribe(value => this.selectedSkill = value);
    this.selectedSkillService.skillUsed.subscribe(value => this.skillUsed(value));
    this.selectedSkillService.keycodeSelect.subscribe(value => this.keycodeSelect(value))
  }

  ngOnInit(): void {
    this.updateSkills();
  }

}
