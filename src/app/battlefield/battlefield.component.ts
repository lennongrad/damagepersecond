import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs'
import { AnimationInformation } from '../animation-information';
import { CharacterInstance } from '../character-instance';
import { EnemyInstance } from '../enemy-instance';
import { CharacterInstancesService } from '../character-instances.service';
import { EnemyInstancesService } from '../enemy-instances.service';

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.less']
})
export class BattlefieldComponent implements OnInit {
  getCharacterInstances(): Array<CharacterInstance> {
    return this.characterInstancesService.characterInstances;
  }

  getEnemyInstances(): Array<EnemyInstance> {
    return this.enemyInstancesService.enemyInstances;
  }

  getSpriteStyle(isCharacter: boolean, index: number): any {
    var style: { [klass: string]: any } = {};

    style["top"] = (index * 20) - 20 + "px";
    
    if(isCharacter){
      style["right"] = (index * 35) + "px";
    } else {
      style["left"] = (index * 35) + "px";
    }

    return style;
  }

  constructor(private characterInstancesService: CharacterInstancesService,
    private enemyInstancesService: EnemyInstancesService) { }

  ngOnInit(): void {
  }

}
