import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../dialogs/settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.less']
})
export class TopbarComponent implements OnInit {

  openSettings(): void{
    var dialogConfig: MatDialogConfig = {
      autoFocus: true,
      panelClass: "dialog-panel",
      backdropClass: "dialog-backdrop",
      data: {}
    }

    this.dialogService.open(SettingsDialogComponent, dialogConfig);
  }

  constructor(private dialogService: MatDialog) { }

  ngOnInit(): void {
  }

}
