import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ENCOUNTERS } from 'src/app/data/enemy-list';
import { TimelineService } from 'src/app/services/timeline.service';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';


@Component({
  selector: 'app-encounter-selector',
  templateUrl: './encounter-selector.component.html',
  styleUrls: ['./encounter-selector.component.less']
})
export class EncounterSelectorComponent implements OnInit {
  encounterList = ENCOUNTERS;

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
