import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'underscore';
import { Skill } from './skill';
import { cloneable } from './cloneable';

export type SkillGrid = Array<Array<Skill | undefined>>
export interface SlotIndex { x: number, y: number };

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  currentSkillGrid: SkillGrid = Array<Array<Skill | undefined>>(3).fill([]).map(() => new Array());
  currentGridChange = new Subject<SkillGrid>();

  currentTime = -1;
  gridTimeMax = 0;

  getGridMax(): number{
    return this.getCurrentSkillGrid()[0].length;
  }

  getCurrentSkillGrid(): SkillGrid{
    return this.currentSkillGrid;
  }

  processTime() {
    if (this.gridTimeMax > 0) {
      if (isNaN(this.currentTime)) {
        this.currentTime = -1;
      }
      this.currentTime = (this.currentTime + 1) % this.gridTimeMax;

      for (var rowIndex in this.getCurrentSkillGrid()) {
        this.getCurrentSkillGrid()[rowIndex][this.currentTime]?.effect();
      }
    } else {
      this.currentTime = -1;
    }
  }

  insertSkill(slotIndex: number, rowIndex: number, skill: Skill | undefined): SlotIndex {
    var currentIndex = slotIndex;
    var movingSkill = skill;
    while (this.getCurrentSkillGrid()[rowIndex][currentIndex] != undefined) {
      var nextSkill = this.getCurrentSkillGrid()[rowIndex][currentIndex];
      this.getCurrentSkillGrid()[rowIndex][currentIndex] = movingSkill;
      movingSkill = nextSkill;

      currentIndex += 1;
      this.setGridMax(currentIndex);
    }
    this.getCurrentSkillGrid()[rowIndex][currentIndex] = movingSkill;
    this.setGridMax(currentIndex + 8)

    return {x: currentIndex, y: rowIndex};
  }

  deleteSkill(rowIndex: number, slotIndex: number) {
    this.getCurrentSkillGrid()[rowIndex][slotIndex] = undefined;
  }

  setGridMax(newMax: number): void {
    for (var rowIndex in this.getCurrentSkillGrid()) {
      while (this.getCurrentSkillGrid()[rowIndex].length < newMax) {
        this.getCurrentSkillGrid()[rowIndex].push(undefined);
      }
    }
  }

  forEachSlot(callback: (rowIndex: number, slotIndex: number) => void): void {
    _.forEach(this.getCurrentSkillGrid(), (row, rowIndex) => {
      _.forEach(row, (_skill, slotIndex) => {
        callback(rowIndex, slotIndex);
      })
    })
  }

  updateGrid(): void {
    this.gridTimeMax = 1 + _.reduce(this.getCurrentSkillGrid(), (highest: number, arr: Array<Skill | undefined>) => {
      return Math.max(highest, _.max(arr.map((value, index) => value == undefined ? -1 : index)));
    }, 0)

    this.currentGridChange.next(this.getCurrentSkillGrid());
  }

  constructor() {   }
}
