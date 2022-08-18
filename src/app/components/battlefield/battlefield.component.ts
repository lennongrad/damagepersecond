import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CharacterInstance } from 'src/app/classes/character-instance';
import { EnemyInstance } from 'src/app/classes/enemy-instance';
import { UnitInstance } from 'src/app/classes/unit-instance';
import { BeautifyService } from 'src/app/services/beautify.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.less']
})
export class BattlefieldComponent implements OnInit {
  getCharacterInstances(): Array<CharacterInstance> {
    return this.unitInstancesService.characterInstances;
  }

  getEnemyInstances(): Array<EnemyInstance> {
    return this.unitInstancesService.enemyInstances;
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
  
  beautify(value: number){
    return this.beautifyService.beautify(value, true);
  }

  mouseoverUnit(event: any, hoveredUnit: UnitInstance) {
    this.tooltipService.setUnitTooltip(hoveredUnit, event.toElement ? event.toElement : event.target, .9);
  }

  mouseoutUnit(event: any, hoveredUnit: UnitInstance) {
    this.tooltipService.setUnitTooltip(undefined, undefined, 0);
  }

  constructor(private unitInstancesService: UnitInstancesService,
    private cdref: ChangeDetectorRef,
    private tooltipService: TooltipService,
    private beautifyService: BeautifyService) { }

  ngOnInit(): void {
    this.cdref.detectChanges();
  }

}
