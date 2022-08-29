import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CharacterInstance } from 'src/app/classes/character-instance';
import { EnemyInstance } from 'src/app/classes/enemy-instance';
import { UnitInstance } from 'src/app/classes/unit-instance';
import { BeautifyService } from 'src/app/services/beautify.service';
import { TimelineService } from 'src/app/services/timeline.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';
import { EncounterSelectorComponent } from '../encounter-selector/encounter-selector.component';

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.less']
})
export class BattlefieldComponent implements OnInit {
  horizontalSpriteDistance = 45;
  verticalSpriteDistance = 20;

  getCharacterInstances(): Array<CharacterInstance> {
    return this.unitInstancesService.characterInstances;
  }

  getEnemyInstances(): Array<EnemyInstance> {
    return this.unitInstancesService.enemyInstances;
  }

  getSpriteStyle(isCharacter: boolean, index: number): any {
    var style: { [klass: string]: any } = {};

    style["top"] = (index * this.verticalSpriteDistance) - 25 + "px";

    if (isCharacter) {
      style["right"] = (index * this.horizontalSpriteDistance) + "px";
    } else {
      style["left"] = (index * this.horizontalSpriteDistance) + "px";
    }

    return style;
  }

  beautify(value: number) {
    return this.beautifyService.beautify(value, true);
  }

  mouseoverUnit(event: any, hoveredUnit: UnitInstance) {
    this.tooltipService.setUnitTooltip(hoveredUnit, event.toElement ? event.toElement : event.target, .9);
  }

  mouseoutUnit(event: any, hoveredUnit: UnitInstance) {
    this.tooltipService.setUnitTooltip(undefined, undefined, 0);
  }

  enemyClick() {
    var dialogConfig: MatDialogConfig = {
      autoFocus: true,
      panelClass: "encounter-select-dialog",
      backdropClass: "encounter-select-backdrop",
      data: {}
    }

    const dialogRef = this.dialogService.open(EncounterSelectorComponent, dialogConfig);
  }

  constructor(private unitInstancesService: UnitInstancesService,
    private cdref: ChangeDetectorRef,
    private tooltipService: TooltipService,
    private beautifyService: BeautifyService,
    private timelineService: TimelineService,
    private dialogService: MatDialog) { }

  ngOnInit(): void {
    this.cdref.detectChanges();
  }

}
