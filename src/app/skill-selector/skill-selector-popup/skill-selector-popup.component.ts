import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from "@angular/material/dialog";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'skill-selector-popup',
  templateUrl: './skill-selector-popup.component.html',
  styleUrls: ['./skill-selector-popup.component.less']
})
export class SkillSelectorPopupComponent implements OnInit {

  form: FormGroup;
  description: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SkillSelectorPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { description?: string }) {

    if (data.description == undefined) {
      data.description = "";
    }

    this.description = data.description;
    this.form = fb.group({
      description: [this.description, []],
    });
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}