import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CharacterInstance } from 'src/app/classes/character-instance';
import { EnemyInstance } from 'src/app/classes/enemy-instance';
import { UnitInformation } from 'src/app/interfaces/unit-information';
import { UnitInstance } from 'src/app/classes/unit-instance';
import { CharacterInstancesService } from 'src/app/services/character-instances.service';
import { EnemyInstancesService } from 'src/app/services/enemy-instances.service';
import { TooltipService } from 'src/app/services/tooltip.service';

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

    style["top"] = (index * 20) - 25 + "px";
    
    if(isCharacter){
      style["right"] = (index * 35) + "px";
    } else {
      style["left"] = (index * 35) + "px";
    }

    return style;
  }

  mouseoverUnit(event: any, hoveredUnit: UnitInstance) {
    this.tooltipService.setUnitTooltip(hoveredUnit, event.toElement, .9);
  }

  mouseoutUnit(event: any, hoveredUnit: UnitInstance) {
    this.tooltipService.setUnitTooltip(undefined, undefined, 0);
  }

  constructor(private characterInstancesService: CharacterInstancesService,
    private enemyInstancesService: EnemyInstancesService,
    private cdref: ChangeDetectorRef,
    private tooltipService: TooltipService) { }

  ngOnInit(): void {
    this.cdref.detectChanges();
  }

}
