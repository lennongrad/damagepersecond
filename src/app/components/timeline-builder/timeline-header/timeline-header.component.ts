import { Component, OnInit } from '@angular/core';
import { SoundInformation } from 'src/app/interfaces/sound-information';
import { SoundEffectPlayerService } from 'src/app/services/sound-effect-player.service';
import { TimelineService } from 'src/app/services/timeline.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-timeline-header',
  templateUrl: './timeline-header.component.html',
  styleUrls: ['./timeline-header.component.less']
})
export class TimelineHeaderComponent implements OnInit {
  isRenaming = false;

  trackPingNoise: SoundInformation = {
    audioFilename: "tracknoise.mp3",
    playbackRateMin: 3,
    playbackRateMax: 4,
    volume: .5,
    concurrentMaximum: 6,
    replacePrevious: true,
    timeSinceLast: 100
  }

  trackPlacementNoise: SoundInformation = {
    audioFilename: "tracknoise.mp3",
    playbackRateMin: 2,
    playbackRateMax: 3,
    volume: 1,
    concurrentMaximum: 1,
    replacePrevious: true
  }

  getTimeDisplay(): string {
    if (this.timelineService.gridTimeMax == 0) {
      return "EMPTY";
    }
    return this.timelineService.currentTime + 1 + "/" + this.timelineService.gridTimeMax + "s";
  }

  getCurrentTime(): number {
    return this.timelineService.currentTime;
  }

  getGridName() {
    return this.timelineService.currentGridName;
  }

  getAutomaticProgress() {
    return this.timelineService.automaticProgress;
  }

  getGridNames(sorted: boolean = false): Array<string> {
    if (this.timelineService.savedGridNames == undefined) {
      return [];
    }
    if (sorted) {
      return _.sortBy(this.timelineService.savedGridNames, (name) => {
        return name != this.timelineService.currentGridName ? ("z" + name) : " ";
      });
    }
    return this.timelineService.savedGridNames;
  }

  processTime(): void {
    this.timelineService.clickProcess();
  }

  duplicateGrid(): void{
    this.timelineService.newGrid(true);
  }

  newGrid(): void {
    this.timelineService.newGrid();
  }

  deleteGrid(): void {
    if (confirm("Are you sure you want to delete the current skill timeline?")) {
      this.timelineService.deleteGrid(this.timelineService.currentGridName, true);
    }
  }

  renameGrid(event: any): void {
    this.timelineService.renameGrid(event.path[0].value.toUpperCase());
  }

  changeGrid(name: string): void {
    this.timelineService.loadGrid(name);
  }

  toggleAutomaticProgress(): void {
    this.timelineService.automaticProgress = !this.timelineService.automaticProgress;
  }

  trackNoise(): void {
    this.soundEffectPlayer.playSound(this.trackPingNoise)
  }

  buttonClick(): void {
    this.soundEffectPlayer.playSound(this.trackPlacementNoise);
  }
  
  mouseoverText(event: any, text: string) {
    this.tooltipService.setTextTooltip(text, event.toElement ? event.toElement : event.target, 1);
  }

  mouseoutText() {
    this.tooltipService.setTextTooltip("", undefined, 0);
  }

  constructor(
    private timelineService: TimelineService,
    private soundEffectPlayer: SoundEffectPlayerService,
    private tooltipService: TooltipService
  ) { }

  ngOnInit(): void {
  }

}
