import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BeautifyService } from 'src/app/services/beautify.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { TimelineService } from 'src/app/services/timeline.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';
import { SettingsDialogComponent } from '../dialogs/settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.less']
})
export class TopbarComponent implements OnInit {
  selectTab(tab: string): void {
    this.unitInstancesService.selectTab(tab);
  }

  openSettings(): void {
    var dialogConfig: MatDialogConfig = {
      autoFocus: true,
      panelClass: "dialog-panel",
      backdropClass: "dialog-backdrop",
      data: {}
    }

    this.dialogService.open(SettingsDialogComponent, dialogConfig);
  }

  getGold(): string {
    return this.beautifyService.beautify(this.inventoryService.gold, true);
  }

  getGoldPerSecond(): string {
    var amount = this.inventoryService.getGPS(this.timelineService.getTimelineLength())
    return this.beautifyService.beautify(amount / this.timelineService.getTimeScale(), true);
  }

  mouseoverText(event: any, text: string): void {
    this.tooltipService.setTextTooltip(text, event.toElement ? event.toElement : event.target, 1);
  }

  mouseoutText(): void {
    this.tooltipService.setTextTooltip("", undefined, 0);
  }

  constructor(private dialogService: MatDialog,
    private inventoryService: InventoryService,
    private unitInstancesService: UnitInstancesService,
    private beautifyService: BeautifyService,
    private timelineService: TimelineService,
    private tooltipService: TooltipService) { }

  ngOnInit(): void {
  }

}
