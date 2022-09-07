import { animation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { CharacterInstance } from 'src/app/classes/character-instance';
import { SaveService } from 'src/app/services/save.service';
import { SoundEffectPlayerService } from 'src/app/services/sound-effect-player.service';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.less']
})
export class CharacterViewComponent implements OnInit {
  activeView!: string;

  getSelectedCharacter(): CharacterInstance {
    return this.unitInstancesService.selectedCharacter;
  }

  getPortraitStyle(): any {
    var style: { [klass: string]: any } = {};

    var animationDetails = this.getSelectedCharacter().characterInformation.animation;

    style["background-image"] = "url(assets/" + animationDetails.imageURL + ")";

    if (animationDetails.portraitOffsetX != undefined) {
      style["background-position-x.px"] = animationDetails.portraitOffsetX;
    }
    if (animationDetails.portraitOffsetY != undefined) {
      style["background-position-y.px"] = animationDetails.portraitOffsetY;
    }

    return style;
  }

  setView(newView: string): void {
    this.activeView = newView;
    this.saveService.saveData("last-character-view", this.activeView);
    this.soundPlayerService.playSound(this.soundPlayerService.buttonClickNoise);
  }

  constructor(private unitInstancesService: UnitInstancesService,
    private saveService: SaveService,
    private soundPlayerService: SoundEffectPlayerService) { }

  ngOnInit(): void {
    try {
      this.activeView = this.saveService.getData("last-character-view") as string;
      if (this.activeView == "") {
        throw new Error();
      }
    } catch {
      this.activeView = "skill";
    }
  }

}
