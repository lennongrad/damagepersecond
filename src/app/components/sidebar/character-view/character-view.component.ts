import { animation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { CharacterInstance } from 'src/app/classes/character-instance';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.less']
})
export class CharacterViewComponent implements OnInit {
  activeView = "skill";
  
  getSelectedCharacter(): CharacterInstance{
    return this.unitInstancesService.selectedCharacter;
  }

  getPortraitStyle(): any{
    var style: { [klass: string]: any } = {};

    var animationDetails = this.getSelectedCharacter().characterInformation.animation;

    style["background-image"] = "url(assets/" + animationDetails.imageURL + ")";

    if(animationDetails.portraitOffsetX != undefined){
      style["background-position-x.px"] = animationDetails.portraitOffsetX;
    }
    if(animationDetails.portraitOffsetY != undefined){
      style["background-position-y.px"] = animationDetails.portraitOffsetY;
    }

    return style;
  }

  setView(newView: string): void{
    this.activeView = newView;
  }

  constructor(private unitInstancesService: UnitInstancesService) { }

  ngOnInit(): void {
  }

}
