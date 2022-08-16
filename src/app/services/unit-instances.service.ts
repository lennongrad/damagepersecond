import { Injectable } from '@angular/core';
import { CharacterInstance } from '../classes/character-instance';
import { EnemyInstance } from '../classes/enemy-instance';
import { UnitInstance } from '../classes/unit-instance';
import { CHARACTERS } from '../data/character-list';
import { ENEMIES } from '../data/enemy-list';
import { CharacterSave } from '../interfaces/unit-information';
import { SaveService } from './save.service';
import { TimelineService } from './timeline.service';

@Injectable({
  providedIn: 'root'
})
export class UnitInstancesService {
  characterInstances: Array<CharacterInstance> = [
    new CharacterInstance("A", CHARACTERS[0], this),
    new CharacterInstance("B", CHARACTERS[1], this),
    new CharacterInstance("C", CHARACTERS[2], this)
  ]
  enemyInstances: Array<EnemyInstance> = [
    new EnemyInstance("A", ENEMIES[0], this),
    new EnemyInstance("B", ENEMIES[0], this),
    new EnemyInstance("C", ENEMIES[0], this)
  ]

  forEachUnit(callback: (unit: UnitInstance) => void): void{
    this.characterInstances.forEach(character => callback(character));
    this.enemyInstances.forEach(enemy => callback(enemy));
  }

  resetUnits(): void {
    this.forEachUnit((unit) => unit.reset());
  }

  saveData(character: CharacterInstance): void {
    var data = JSON.stringify(character.permanentData)
    this.saveService.saveData("character-" + character.characterInformation.name, data);
  }

  loadData(character: CharacterInstance): CharacterSave | undefined {
    var dataString = this.saveService.getData("character-" + character.characterInformation.name);

    if(dataString != null){
      try{
        var data = JSON.parse(dataString) as CharacterSave;
        return data;
      } catch{
        return undefined;
      }
    } else{
      return undefined;
    }
  }

  rewardXP(amount: number): void{
    this.characterInstances.forEach(character => {
      character.addXP(amount);
    })
  }

  constructor(private saveService: SaveService) { }
}
