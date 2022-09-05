import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './components/timeline-builder/timeline/timeline.component';
import { SkillSelectorComponent } from './components/timeline-builder/skill-selector/skill-selector.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TimelineBuilderComponent } from './components/timeline-builder/timeline-builder.component';
import { SkillTooltipComponent } from './components/tooltips/skill-tooltip/skill-tooltip.component';
import { CommonModule } from '@angular/common';
import { HorizontalScrollDirective } from './directives/horizontal-scroll-directive.directive';
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkillSelectorPopupComponent } from './components/dialogs/skill-selector-popup/skill-selector-popup.component';
import { FocusOnShowDirective } from './directives/focus-on-show.directive';
import { AnimatedSpriteComponent } from './components/animated-sprite/animated-sprite.component';
import { BattlefieldComponent } from './components/battlefield/battlefield.component';
import { UnitTooltipComponent } from './components/tooltips/unit-tooltip/unit-tooltip.component';
import { EncounterSelectorComponent } from './components/dialogs/encounter-selector/encounter-selector.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SettingsDialogComponent } from './components/dialogs/settings-dialog/settings-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TimelineHeaderComponent } from './components/timeline-builder/timeline-header/timeline-header.component';
import { FeatureListComponent } from './components/sidebar/feature-list/feature-list.component';
import { SkillListComponent } from './components/sidebar/skill-list/skill-list.component';
import { CharacterViewComponent } from './components/sidebar/character-view/character-view.component';
import { StatsListComponent } from './components/sidebar/stats-list/stats-list.component';
import { TextTooltipComponent } from './components/tooltips/text-tooltip/text-tooltip.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    SkillSelectorComponent,
    TimelineBuilderComponent,
    SkillTooltipComponent,
    HorizontalScrollDirective,
    SkillSelectorPopupComponent,
    FocusOnShowDirective,
    AnimatedSpriteComponent,
    BattlefieldComponent,
    UnitTooltipComponent,
    EncounterSelectorComponent,
    SidebarComponent,
    TopbarComponent,
    SettingsDialogComponent,
    TimelineHeaderComponent,
    FeatureListComponent,
    SkillListComponent,
    CharacterViewComponent,
    StatsListComponent,
    TextTooltipComponent
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
    MatInputModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SkillSelectorPopupComponent]
})
export class AppModule {
}
