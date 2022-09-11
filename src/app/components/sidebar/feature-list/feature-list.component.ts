import { Component, OnInit } from '@angular/core';
import { CharacterInstance } from 'src/app/classes/character-instance';
import { SkillInformation } from 'src/app/interfaces/skill-information';
import { SoundInformation } from 'src/app/interfaces/sound-information';
import { CharacterFeature } from 'src/app/interfaces/unit-information';
import { BeautifyService } from 'src/app/services/beautify.service';
import { SoundEffectPlayerService } from 'src/app/services/sound-effect-player.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.less']
})
export class FeatureListComponent implements OnInit {


  getFeatures(): Array<CharacterFeature> {
    return this.getSelectedCharacter().getFeatureList();
  }

  isFeatureAffordable(feature: CharacterFeature): boolean {
    return this.getSelectedCharacter().canAffordFeature(feature);
  }

  isFeatureLearnt(feature: CharacterFeature): boolean {
    return this.getSelectedCharacter().hasLearntFeature(feature);
  }

  getFeatureCost(feature: CharacterFeature): number{
    return this.getSelectedCharacter().getFeatureCost(feature);
  }

  getSelectedCharacter(): CharacterInstance {
    return this.unitInstancesService.selectedCharacter;
  }

  beautify(value: number): string {
    return this.beautifyService.beautify(value, true);
  }

  clickFeature(feature: CharacterFeature): void {
    this.getSelectedCharacter().buyFeature(feature);
    this.soundEffectPlayer.playSound(this.soundEffectPlayer.trackPingNoise);
  }

  mouseoverSkill(event: any, hoveredSkill: SkillInformation): void {
    this.tooltipService.setSkillTooltip(hoveredSkill, event.toElement ? event.toElement : event.target, 1);
  }

  mouseoutSkill(): void {
    this.tooltipService.setSkillTooltip(undefined, undefined, 0);
  }

  constructor(private unitInstancesService: UnitInstancesService,
    private tooltipService: TooltipService,
    private beautifyService: BeautifyService,
    private soundEffectPlayer: SoundEffectPlayerService) { }

  ngOnInit(): void {
  }

}
