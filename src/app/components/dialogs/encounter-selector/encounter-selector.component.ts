import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ENCOUNTERS } from 'src/app/data/enemy-list';
import { ITEMS } from 'src/app/data/item-list';
import { Item } from 'src/app/interfaces/item-information';
import { EncounterInformation } from 'src/app/interfaces/unit-information';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';
import * as _ from 'underscore';
import { ItemTooltipComponent } from '../../tooltips/item-tooltip/item-tooltip.component';
import { TextTooltipComponent } from '../../tooltips/text-tooltip/text-tooltip.component';


@Component({
  selector: 'app-encounter-selector',
  templateUrl: './encounter-selector.component.html',
  styleUrls: ['./encounter-selector.component.less']
})
export class EncounterSelectorComponent implements OnInit {
  encounterList = ENCOUNTERS;
  @ViewChild("itemtooltip") itemTooltip!: ItemTooltipComponent;

  horizontalSpriteDistance = 40;

  getSpriteStyle(index: number): any {
    var style: { [klass: string]: any } = {};

    //style["top"] = (index * this.verticalSpriteDistance) - 25 + "px";
    style["left"] = (index * this.horizontalSpriteDistance) - 40 + "px";

    return style;
  }

  getStars(count: number): string {
    var baseString = "";
    for(var i = 0; i < 5; i++){
      if(i < count){
        baseString += "✭";
      } else {
        baseString += "☆";
      }
    }
    return baseString;
  }

  clickEncounter(encounterID: string): void {
    this.unitInstancesService.loadEncounter(encounterID);
    this.close();
  }

  isActiveDifficulty(difficulty: number): boolean{
    return difficulty == this.unitInstancesService.enemyDifficulty;
  }

  clickDifficulty(difficulty: number): void{
    this.unitInstancesService.loadEncounter(undefined, difficulty);
  }

  getItem(id: string): Item{
    return ITEMS[id];
  }

  mouseoverItem(event: any, hoveredItem: Item): void {
    this.itemTooltip.hoveredItem = hoveredItem;
    this.itemTooltip.element = event.toElement ? event.toElement : event.target;
    this.itemTooltip.opacity = .9;
    this.itemTooltip.update();
  }

  mouseoutItem(): void {
    this.itemTooltip.opacity = 0;
  }

  constructor(
    private dialogRef: MatDialogRef<EncounterSelectorComponent>,
    private unitInstancesService: UnitInstancesService,
    @Inject(MAT_DIALOG_DATA) public data: { description?: string }) {
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }
}
