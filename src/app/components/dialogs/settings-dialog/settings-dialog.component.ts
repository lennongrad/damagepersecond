import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.less']
})
export class SettingsDialogComponent implements OnInit {
  get bigIconsOn(): boolean {
    return this.settingsService.bigIconsOn;
  }

  set bigIconsOn(enabled: boolean) {
    this.settingsService.bigIconsOn = enabled;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { description?: string },
    private settingsService: SettingsService) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
