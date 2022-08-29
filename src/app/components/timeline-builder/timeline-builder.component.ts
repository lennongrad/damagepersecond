import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TimelineService } from 'src/app/services/timeline.service';
import { SelectedSkillService } from '../../services/selected-skill.service';
import { SkillSelectorPopupComponent } from '../dialogs/skill-selector-popup/skill-selector-popup.component';

@Component({
  selector: 'app-timeline-builder',
  templateUrl: './timeline-builder.component.html',
  styleUrls: ['./timeline-builder.component.less']
})
export class TimelineBuilderComponent implements OnInit {

  onKeydown(event: any) {
    this.selectedSkillService.keycodeSelect.next(event.keyCode);
  }

  load(): void{
    this.timelineService.loadGrid();
  }

  openPopup(){
    var dialogConfig: MatDialogConfig = {
      autoFocus: true,
      panelClass: "dialog-panel",
      backdropClass: "dialog-backdrop",
      data: {}
    }
    this.dialogService.open(SkillSelectorPopupComponent, dialogConfig);
  }

  constructor(private selectedSkillService: SelectedSkillService,
    private dialogService: MatDialog,
    private timelineService: TimelineService) { }

  ngOnInit(): void {
    this.load();
  }

}
