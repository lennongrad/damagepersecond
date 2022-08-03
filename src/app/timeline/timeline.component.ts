import { Component, OnInit, HostListener } from '@angular/core';
import { Skill } from '../skill';
import { SoundInfo } from '../soundinfo';
import { SelectedSkillService } from '../selected-skill.service';
import { SoundEffectPlayerService } from '../sound-effect-player.service';
import { TimelineService, SkillGrid, SlotIndex } from '../timeline.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.less']
})
export class TimelineComponent implements OnInit {
  selectedSkill?: Skill;
  onSelectSkill(skill?: Skill): void {
    this.selectedSkillService.changeSelectedSkill(skill);
  }

  pressedKeys: { [keycode: string]: boolean } = {};
  @HostListener('window:keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) { this.pressedKeys[event.key] = true; }
  @HostListener('document:keyup', ['$event'])
  onKeyDown(event: KeyboardEvent) { this.pressedKeys[event.key] = false; }

  slotWidth = 30;
  slotHeight = 31;

  selectedSlots = Array<Array<boolean>>(3).fill([]).map(() => new Array());
  selectedRow = 0;

  initialDragIndex?: SlotIndex;
  currentDragIndex?: SlotIndex;
  dragDisplacement?: SlotIndex;
  dragBox = { left: -1, right: -1, top: -1, bottom: -1 };
  draggingSkill?: Boolean;

  hoveredTooltipSkill?: Skill;
  hoveredElement?: Element;
  hoveredOpacity = 0;

  trackPingNoise: SoundInfo = {
    audioFilename: "../../assets/tracknoise.mp3",
    playbackRateMin: 3,
    playbackRateMax: 4,
    volume: .5,
    concurrentMaximum: 6,
    replacePrevious: true
  }

  trackPlacementNoise: SoundInfo = {
    audioFilename: "../../assets/tracknoise.mp3",
    playbackRateMin: 2,
    playbackRateMax: 3,
    volume: 1,
    concurrentMaximum: 1,
    replacePrevious: true
  }

  processTime(): void {
    this.timelineService.processTime();
  }

  setSkillGrid(skillGrid: SkillGrid): void {
    for (var rowIndex in this.selectedSlots) {
      while (this.selectedSlots[rowIndex].length < skillGrid[0].length) {
        this.selectedSlots[rowIndex].push(false);
      }
    }
  }

  getSkillGrid(): SkillGrid {
    return this.timelineService.getCurrentSkillGrid();
  }

  getCurrentTime(): number {
    return this.timelineService.currentTime;
  }

  getMaxTime(): number {
    return this.timelineService.gridTimeMax;
  }

  getSlotStyle(slotIndex: number, rowIndex: number): any {
    if (this.initialDragIndex == undefined
      || this.currentDragIndex == undefined
      || this.dragDisplacement == undefined) {
      return {};
    }

    var style: { [klass: string]: any } = {};

    if (!this.draggingSkill && slotIndex >= this.dragBox.left && slotIndex <= this.dragBox.right
      && rowIndex >= this.dragBox.top && rowIndex <= this.dragBox.bottom) {
      style["background-color"] = "rgba(20, 20, 200, .3)";
    }

    return style;
  }

  getIconStyle(slotIndex: number, rowIndex: number): any {
    if (this.initialDragIndex == undefined
      || this.currentDragIndex == undefined
      || this.dragDisplacement == undefined) {
      return {};
    }

    var style: { [klass: string]: any } = {};

    if (this.selectedSlots[rowIndex][slotIndex] && this.draggingSkill) {
      var translateX = "translateX(" + (this.dragDisplacement.x * this.slotWidth) + "px)"
      var translateY = "translateY(" + (this.dragDisplacement.y * this.slotHeight) + "px)"
      style["transform"] = translateX + " " + translateY;
      style["opacity"] = ".4"
    }

    return style;
  }

  forEachSelected(callback: (rowIndex: number, slotIndex: number) => void): void {
    this.timelineService.forEachSlot((rowIndex, slotIndex) => {
      if (this.selectedSlots[rowIndex][slotIndex]) {
        callback(rowIndex, slotIndex);
      }
    })
  }

  clickSlot(slotIndex: number, rowIndex: number, event: MouseEvent): void {
    if (this.selectedSkill != undefined) {
      this.timelineService.insertSkill(slotIndex, rowIndex, this.selectedSkill);

      if (this.selectedSkill != undefined) {
        this.selectedSkillService.useSkill(this.selectedSkill);
      }

      if (!event.ctrlKey) {
        this.onSelectSkill(undefined);
      }

      this.soundEffectPlayer.playSound(this.trackPlacementNoise);
      this.clearSelection();
      this.timelineService.updateGrid();
    } else {
      this.selectSlot(slotIndex, rowIndex, event.shiftKey);
    }
  }

  selectSlot(slotIndex: number, rowIndex: number, holdingSHIFT: boolean): void {
    if (rowIndex != this.selectedRow) {
      this.selectedRow = rowIndex;
    }

    if (this.getSkillGrid()[rowIndex][slotIndex] != undefined) {
      if (holdingSHIFT) {
        this.selectedSlots[rowIndex][slotIndex] = !this.selectedSlots[rowIndex][slotIndex];
      } else {
        var previouslySelected = this.selectedSlots[rowIndex][slotIndex];
        this.clearSelection();
        this.selectedSlots[rowIndex][slotIndex] = !previouslySelected;
      }
      this.soundEffectPlayer.playSound(this.trackPlacementNoise);
    } else {
      this.clearSelection();
    }
  }

  deleteSelection() {
    this.forEachSelected((rowIndex, slotIndex) => {
      this.timelineService.deleteSkill(rowIndex, slotIndex);
      this.selectedSlots[rowIndex][slotIndex] = false;
    })
    this.timelineService.updateGrid();
  }

  duplicateSelection() {
    var firstX = this.timelineService.getGridMax();
    var lastX = 0;
    this.forEachSelected((rowIndex, slotIndex) => {
      if (slotIndex < firstX) { firstX = slotIndex }
      if (slotIndex > lastX) { lastX = slotIndex }
    })

    this.forEachSelected((rowIndex, slotIndex) => {
      this.timelineService.insertSkill(slotIndex + (lastX - firstX) + 1, rowIndex, this.getSkillGrid()[rowIndex][slotIndex])
    })

    this.timelineService.updateGrid();
  }

  moveSelection(displacement: SlotIndex) {
    const selectedSlotIndices = Array<SlotIndex>();
    const selectedItems = Array<Skill | undefined>();
    this.timelineService.forEachSlot((rowIndex, slotIndex) => {
      if (this.selectedSlots[rowIndex][slotIndex]) {
        selectedSlotIndices.push({ x: slotIndex, y: rowIndex });
        selectedItems.push(this.getSkillGrid()[rowIndex][slotIndex]);
        this.timelineService.deleteSkill(rowIndex, slotIndex);
      }
    })

    this.clearSelection();

    for (var i = selectedSlotIndices.length - 1; i >= 0; i--) {
      var displacedIndex = {
        x: Math.max(0, Math.min(this.selectedSlots[0].length, selectedSlotIndices[i].x + displacement.x)),
        y: Math.max(0, Math.min(2, selectedSlotIndices[i].y + displacement.y))
      }

      var endIndex = this.timelineService.insertSkill(displacedIndex.x, displacedIndex.y, selectedItems[i]);
      if(this.selectedSlots[displacedIndex.y][displacedIndex.x])
      {
        this.selectedSlots[endIndex.y][endIndex.x] = true;
      } else {
        this.selectedSlots[displacedIndex.y][displacedIndex.x] = true
      }
    }

    this.soundEffectPlayer.playSound(this.trackPlacementNoise);
    this.timelineService.updateGrid();
  }

  clearSelection() {
    this.timelineService.forEachSlot((rowIndex, slotIndex) => this.selectedSlots[rowIndex][slotIndex] = false);
  }

  onDragStart(slotIndex: number, rowIndex: number, event: any): void {
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    this.initialDragIndex = { x: slotIndex, y: rowIndex };
    this.draggingSkill = this.getSkillGrid()[rowIndex][slotIndex] != undefined;

    if (this.draggingSkill) {
      this.selectedSlots[rowIndex][slotIndex] = true;
    }
  }

  onDragOver(slotIndex: number, rowIndex: number, event: any): void {
    if (this.initialDragIndex == undefined) {
      return;
    }

    var lastDisplacement = this.dragDisplacement
    this.currentDragIndex = { x: slotIndex, y: rowIndex };
    this.dragDisplacement = {
      x: this.currentDragIndex.x - this.initialDragIndex.x,
      y: this.currentDragIndex.y - this.initialDragIndex.y
    }
    this.dragBox = {
      left: Math.min(this.initialDragIndex.x, this.currentDragIndex.x),
      right: Math.max(this.initialDragIndex.x, this.currentDragIndex.x),
      top: Math.min(this.initialDragIndex.y, this.currentDragIndex.y),
      bottom: Math.max(this.initialDragIndex.y, this.currentDragIndex.y)
    }

    if (lastDisplacement && this.draggingSkill &&
      (lastDisplacement.x != this.dragDisplacement.x || lastDisplacement.y != this.dragDisplacement.y)) {
      this.soundEffectPlayer.playSound(this.trackPingNoise);
    }

    event.preventDefault();
  }

  onDragEnd(event: any): void {
    if (this.initialDragIndex && this.currentDragIndex && this.dragDisplacement) {
      if (this.draggingSkill) {
        this.moveSelection(this.dragDisplacement)

        this.clearSelection();
      } else {
        if (!this.pressedKeys["Shift"]) {
          this.clearSelection();
        }

        // select all the slots that user dragged over
        for (var x = this.dragBox.left; x <= this.dragBox.right; x++) {
          for (var y = this.dragBox.top; y <= this.dragBox.bottom; y++) {
            if(this.getSkillGrid()[y][x] != undefined)
            {
              this.selectedSlots[y][x] = true;
            }
          }
        }
      }
    }

    this.initialDragIndex = undefined;
    this.currentDragIndex = undefined;
    this.dragDisplacement = undefined;
    this.draggingSkill = undefined;
  }

  mouseoverSlot(event: any, hoveredSkill: Skill) {
    this.hoveredTooltipSkill = hoveredSkill;
    this.hoveredElement = event.toElement;
    this.hoveredOpacity = .9;
  }

  mouseoutSlot(event: any, hoveredSkill: Skill) {
    this.hoveredOpacity = 0;
  }

  constructor(private selectedSkillService: SelectedSkillService,
    private soundEffectPlayer: SoundEffectPlayerService,
    private timelineService: TimelineService) {
    this.selectedSkillService.selectedSkillChange.subscribe(value => this.selectedSkill = value);
    this.timelineService.currentGridChange.subscribe(value => this.setSkillGrid(value));
  }


  ngOnInit(): void {
    this.timelineService.setGridMax(80);
  }
}
