import { Injectable } from '@angular/core';
import { CharacterInstance } from '../classes/character-instance';
import { CHARACTERS } from '../data/character-list';
import { CharacterSave } from '../interfaces/unit-information';
import { SaveService } from './save.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterInstancesService {
  characterInstances: Array<CharacterInstance> = [
    new CharacterInstance("A", CHARACTERS[0], this),
    new CharacterInstance("B", CHARACTERS[1], this),
    new CharacterInstance("C", CHARACTERS[2], this)
  ]

  resetCharacters(): void {
    this.characterInstances.forEach(character => {
      character.reset();
    })
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

  constructor(private saveService: SaveService) { }
}
