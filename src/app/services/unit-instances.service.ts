import { Injectable } from '@angular/core';
import { CharacterInstance } from '../classes/character-instance';
import { EnemyInstance } from '../classes/enemy-instance';
import { UnitInstance } from '../classes/unit-instance';
import { CHARACTERS, GENERIC_FEATURES } from '../data/character-list';
import { ENCOUNTERS } from '../data/enemy-list';
import { CharacterSave } from '../interfaces/unit-information';
import { SaveService } from './save.service';
import { EncounterInformation } from '../interfaces/unit-information';

@Injectable({
  providedIn: 'root'
})
export class UnitInstancesService {
  characterInstances: Array<CharacterInstance> = [
    new CharacterInstance("A", CHARACTERS["eirika"], this, GENERIC_FEATURES),
    new CharacterInstance("B", CHARACTERS["archer"], this, GENERIC_FEATURES),
    new CharacterInstance("C", CHARACTERS["wizard"], this, GENERIC_FEATURES)
  ]

  enemyInstances!: Array<EnemyInstance>;
  selectedEncounter!: EncounterInformation;

  forEachUnit(callback: (unit: UnitInstance) => void): void{
    this.characterInstances.forEach(character => callback(character));
    this.enemyInstances.forEach(enemy => callback(enemy));
  }

  resetUnits(): void {
    this.forEachUnit((unit) => unit.reset());
  }

  saveData(character: CharacterInstance): void {
    var dataStore: any = {};
    dataStore["experience"] = character.permanentData.experience;
    dataStore["learntFeature"] = Array.from(character.permanentData.learntFeatures);

    var data = JSON.stringify(dataStore)
    this.saveService.saveData("character-" + character.characterInformation.name, data);
  }

  loadData(character: CharacterInstance): CharacterSave | undefined {
    var dataString = this.saveService.getData("character-" + character.characterInformation.name);

    if(dataString != null){
      try{
        var baseData = JSON.parse(dataString);
        var modifiedData : CharacterSave = {
          experience: baseData.experience,
          learntFeatures: new Set<string>(baseData.learntFeature)
        };
        return modifiedData;
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

  loadSavedEncounter(): void{
    var savedEncounter: string | undefined = this.saveService.getData("encounter-name");
    if(savedEncounter == null){
      savedEncounter = undefined;
    }
    this.loadEncounter(savedEncounter);
  }

  loadEncounter(name?: string): void{
    if(name != undefined && ENCOUNTERS.hasOwnProperty(name)){
      this.selectedEncounter = ENCOUNTERS[name]
    } else {
      this.selectedEncounter = ENCOUNTERS["training"];
    }
    this.enemyInstances = [
      new EnemyInstance("A", this.selectedEncounter.enemies[0], this),
      new EnemyInstance("B", this.selectedEncounter.enemies[1], this),
      new EnemyInstance("C", this.selectedEncounter.enemies[2], this)
    ]
    this.saveService.saveData("encounter-name", this.selectedEncounter.id);
  }

  constructor(private saveService: SaveService) { 
    this.loadSavedEncounter();
  }
}
