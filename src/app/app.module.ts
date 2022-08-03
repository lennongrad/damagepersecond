import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { SkillSelectorComponent } from './skill-selector/skill-selector.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TimelineBuilderComponent } from './timeline-builder/timeline-builder.component';
import { SkillTooltipComponent } from './skill-tooltip/skill-tooltip.component';
import { CommonModule } from '@angular/common';
import { HorizontalScrollDirective } from './horizontal-scroll-directive.directive';
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkillSelectorPopupComponent } from './skill-selector/skill-selector-popup/skill-selector-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    SkillSelectorComponent,
    TimelineBuilderComponent,
    SkillTooltipComponent,
    HorizontalScrollDirective,
    SkillSelectorPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    DragDropModule,
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SkillSelectorPopupComponent]
})
export class AppModule {
}
