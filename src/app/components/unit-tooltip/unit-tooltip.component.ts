import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, HostListener } from '@angular/core';
import { UnitInstance } from 'src/app/classes/unit-instance';
import { StatusType } from 'src/app/interfaces/status-information';
import { TooltipService } from 'src/app/services/tooltip.service';
import { EnemyInstance } from 'src/app/classes/enemy-instance';
import { BeautifyService } from 'src/app/services/beautify.service';
import { CharacterInstance } from 'src/app/classes/character-instance';
import { TimelineService } from 'src/app/services/timeline.service';


@Component({
  selector: 'app-unit-tooltip',
  templateUrl: './unit-tooltip.component.html',
  styleUrls: ['./unit-tooltip.component.less']
})
export class UnitTooltipComponent implements OnInit {
  @ViewChild('tooltipbox') tooltipBox!: ElementRef;

  @Input() hoveredUnit?: UnitInstance;
  @Input() element?: Element;
  @Input() opacity = 1;

  pressedKeys: { [keycode: string]: boolean } = {};
  @HostListener('window:keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) { this.pressedKeys[event.key] = true; }
  @HostListener('document:keyup', ['$event'])
  onKeyDown(event: KeyboardEvent) { this.pressedKeys[event.key] = false; }

  readonly StatusType = StatusType;

  // calculated so that the tooltip is not offscreen
  topOffset = -1000;
  leftOffset = -1000;

  isEnemy(): boolean {
    return this.hoveredUnit instanceof EnemyInstance;
  }

  update(): void {

    if (this.element != undefined && this.tooltipBox != undefined) {
      var elementRect = this.element.getBoundingClientRect();

      if (this.isEnemy()) {
        if (this.tooltipBox != undefined) {
          var tooltipRect = this.tooltipBox.nativeElement.getBoundingClientRect();
          this.leftOffset = elementRect.x - tooltipRect.width;
          if (this.leftOffset < 0) {
            this.leftOffset = 0;
          }
        }
      } else {
        this.leftOffset = elementRect.x + elementRect.width;

        if (this.tooltipBox != undefined) {
          var tooltipRect = this.tooltipBox.nativeElement.getBoundingClientRect();
          if (this.leftOffset + tooltipRect.width > document.body.clientWidth) {
            this.leftOffset = document.body.clientWidth - tooltipRect.width;
          }
        }
      }

      this.topOffset = elementRect.y + elementRect.height;
    }
  }

  getDPR(): number {
    if (this.hoveredUnit != undefined && this.hoveredUnit instanceof CharacterInstance) {
      return Math.floor(100 * this.hoveredUnit.getDPR(this.timelineService.getTimelineLength())) / 100;
    }
    return -1;
  }

  constructor(private tooltipService: TooltipService, beautifyService: BeautifyService, private timelineService: TimelineService) {
    this.tooltipService.unitTooltip = this;
  }

  ngOnInit(): void {
  }

}
