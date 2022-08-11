import { Injectable } from '@angular/core';
import { Subject, interval, Subscription } from 'rxjs';
import * as _ from 'underscore';
import { Skill, SkillContext, SkillTargetType } from '../interfaces/skill';
import { SaveService } from './save.service';
import { AvailableSkillsService } from './available-skills.service';
import { CharacterInstancesService } from './character-instances.service';
import { EnemyInstancesService } from './enemy-instances.service';
import { CharacterInstance } from '../classes/character-instance';
import { EnemyInstance } from '../classes/enemy-instance';

export type SkillGrid = Array<Array<Skill | undefined>>
export interface SlotIndex { x: number, y: number };

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  currentSkillGrid: SkillGrid = [];
  currentGridChange = new Subject<SkillGrid>();

  savedGridNames?: Array<string>;
  currentGridName = "";

  currentTime = -1;
  gridTimeMax = 0;

  timeSource = interval(20);
  subscription?: Subscription;

  progressTimer = 0;
  automaticProgress = false;
  lastDate = Date.now();
  timelineProceedLimit = 1 / 6;
  timeSinceLastProcess = 0;

  getGridMax(): number {
    return this.getCurrentSkillGrid()[0].length;
  }

  getCurrentSkillGrid(): SkillGrid {
    return this.currentSkillGrid;
  }

  clickProcess() {
    if (this.timeSinceLastProcess > this.timelineProceedLimit) {
      this.processTime();
    }
  }

  resetTime(resetAutomaticProgress: boolean = true) {
    this.characterInstanceService.characterInstances.forEach(character => {
      character.resetCharacter();
    })
    this.enemyInstanceService.enemyInstances.forEach(enemy => {
      enemy.resetEnemy();
    })

    this.currentTime = -1;
    if (resetAutomaticProgress) {
      this.automaticProgress = false;
    } else {
      this.processTime();
    }
  }

  processTime() {
    if (this.gridTimeMax > 0) {
      if (isNaN(this.currentTime)) {
        this.resetTime();
      }
      this.currentTime = this.currentTime + 1;

      if (this.currentTime < this.gridTimeMax) {
        for (var rowIndex in this.getCurrentSkillGrid()) {
          var skill = this.getCurrentSkillGrid()[rowIndex][this.currentTime];
          if (skill != undefined) {
            this.activateSkill(this.characterInstanceService.characterInstances[rowIndex], skill);
          }
        }
      } else {
        this.resetTime(false);
      }
    } else {
      this.resetTime();
    }

    this.timeSinceLastProcess = 0;
  }

  activateSkill(origin: CharacterInstance, skill: Skill) {
    var targets = Array<CharacterInstance | EnemyInstance>();
    switch (skill.target) {
      case SkillTargetType.allButSelf:
        targets = _.without(this.characterInstanceService.characterInstances, origin); break;
      case SkillTargetType.allCharacters:
        targets = this.characterInstanceService.characterInstances; break;
      case SkillTargetType.allEnemies:
        targets = this.enemyInstanceService.enemyInstances; break;
      case SkillTargetType.firstEnemy:
        var firstEnemy = _.find(this.enemyInstanceService.enemyInstances, (enemy) => enemy.isAlive());
        targets = firstEnemy != undefined ? [firstEnemy] : [];
        break;
      case SkillTargetType.firstCharacter:
        var firstCharacter = _.find(this.characterInstanceService.characterInstances, (character) => character.isAlive());
        targets = firstCharacter != undefined ? [firstCharacter] : [];
        break;
      case SkillTargetType.noTarget:
        targets = []; break;
      case SkillTargetType.randomAliveCharacter:
        var aliveCharacters = _.reject(this.characterInstanceService.characterInstances, (character) => character.isAlive());
        targets = _.sample(aliveCharacters, 1); break;
      case SkillTargetType.randomAliveEnemy:
        var aliveEnemies = _.reject(this.enemyInstanceService.enemyInstances, (enemy) => enemy.isAlive());
        targets = _.sample(aliveEnemies, 1); break;
    }

    var context: SkillContext = {
      targets: targets,
      origin: origin
    }
    skill.effect(context);
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

    return { x: currentIndex, y: rowIndex };
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
    this.gridTimeMax = _.reduce(this.getCurrentSkillGrid(), (highest: number, arr: Array<Skill | undefined>) => {
      return Math.max(highest, _.max(arr.map((value, index) => value == undefined ? -1 : index + 1)));
    }, 0)
    this.resetTime();

    this.currentGridChange.next(this.getCurrentSkillGrid());
    this.saveGrid(this.currentGridName);
  }

  setDefaultGrid(): void {
    this.currentSkillGrid = Array<Array<Skill | undefined>>(3).fill([]).map(() => new Array());
    this.setGridMax(40);
  }

  // modify these to be safer
  gridToString(grid: SkillGrid): string {
    var idGrid = _.map(grid, (arr) => _.map(arr, (skill) => skill != undefined ? skill.id : -1));
    return JSON.stringify(idGrid);
  }

  gridFromString(str: string): SkillGrid {
    return _.map(JSON.parse(str), (arr) => _.map(arr, (id) => this.availableSkillService.getSkillById(id)));
  }

  renameGrid(name: string): void {
    this.deleteGrid(this.currentGridName);
    this.currentGridName = name;
    this.saveGrid(this.currentGridName);
  }

  newGrid(): void {
    if (this.savedGridNames == undefined) {
      this.savedGridNames = [];
    }

    var gridNameModifier: string = "";
    while (_.includes(this.savedGridNames, "UNTITLED" + gridNameModifier)) {
      if (gridNameModifier == "") {
        gridNameModifier = "0";
      }
      gridNameModifier = (parseInt(gridNameModifier) + 1).toString();
    }

    this.setDefaultGrid();
    this.saveGrid("UNTITLED" + gridNameModifier);
    this.currentGridName = "UNTITLED" + gridNameModifier;
  }

  deleteGrid(name: string = this.currentGridName, replace: boolean = false): void {
    if (this.savedGridNames == undefined) {
      this.savedGridNames = [];
    }
    this.savedGridNames = _.without(this.savedGridNames, name);
    this.saveService.saveData("gridnames", JSON.stringify(this.savedGridNames));
    this.saveService.removeData("grid-" + name);

    if (replace) {
      this.loadGrid();
    }
  }

  saveGrid(name: string): void {
    this.saveService.saveData("grid-" + name, this.gridToString(this.getCurrentSkillGrid()));

    if (this.savedGridNames == undefined) {
      this.savedGridNames = [name];
    } else if (!_.includes(this.savedGridNames, name)) {
      this.savedGridNames.push(name);
    }
    this.saveService.saveData("gridnames", JSON.stringify(this.savedGridNames));
  }

  loadGrid(name: string | undefined = undefined): void {
    if (this.savedGridNames == undefined) {
      // load existing grid names
      var loadAttempt = this.saveService.getData("gridnames");
      try {
        this.savedGridNames = JSON.parse(loadAttempt);
      } catch (e) {
        this.savedGridNames = [];
      }
    }

    if (this.savedGridNames != undefined && this.savedGridNames.length > 0
      && (_.includes(this.savedGridNames, name) || name == undefined)) {
      // name is present or just trying to load first
      var nameToLoad = name != undefined ? name : _.last(this.savedGridNames);
      if (nameToLoad == undefined) {
        nameToLoad = this.savedGridNames[0];
      }
      var loadAttempt = this.saveService.getData("grid-" + nameToLoad);
      try {
        this.currentSkillGrid = this.gridFromString(loadAttempt);
        // grid can be parsed
        this.currentGridName = nameToLoad;
      } catch (e) {
        console.log("Failed to load name; ", e);
        this.currentGridName = "UNTITLED";
        this.setDefaultGrid();
      }
    } else {
      // no saved grids
      if (name != undefined) {
        console.log("Name not present");
      }
      this.currentGridName = "UNTITLED";
      this.setDefaultGrid();
    }

    this.updateGrid();
  }

  eachMillisecond(time: number): void {
    var delta = Date.now() - this.lastDate;

    if (this.automaticProgress) {
      this.progressTimer += delta / 1000;
    } else {
      this.progressTimer = 0;
    }
    this.timeSinceLastProcess += delta / 1000;

    while (this.progressTimer > this.timelineProceedLimit) {
      this.progressTimer -= this.timelineProceedLimit;
      this.processTime();
    }

    this.lastDate = Date.now();
  }

  constructor(private saveService: SaveService, private availableSkillService: AvailableSkillsService,
    private characterInstanceService: CharacterInstancesService,
    private enemyInstanceService: EnemyInstancesService) {
    this.subscription = this.timeSource.subscribe(time => this.eachMillisecond(time))
  }
}
