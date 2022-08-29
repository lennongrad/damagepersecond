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

  constructor(
    private dialogRef: MatDialogRef<EncounterSelectorComponent>,
    private unitInstancesService: UnitInstancesService,
    private timelineService: TimelineService,
    @Inject(MAT_DIALOG_DATA) public data: { description?: string }) {
  }

  getSpriteStyle(index: number): any {
    var style: { [klass: string]: any } = {};

    //style["top"] = (index * this.verticalSpriteDistance) - 25 + "px";
    style["left"] = (index * this.horizontalSpriteDistance) - 40 + "px";

    return style;
  }

  clickEncounter(encounterID: string){
    this.unitInstancesService.loadEncounter(encounterID);
    this.timelineService.resetTime();
    this.close();
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }
}
