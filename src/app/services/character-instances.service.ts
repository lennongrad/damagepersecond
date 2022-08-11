import { Injectable } from '@angular/core';
import { CharacterInstance } from '../classes/character-instance';
import { CHARACTERS } from '../data/character-list';

@Injectable({
  providedIn: 'root'
})
export class CharacterInstancesService {
  characterInstances: Array<CharacterInstance> = [
    new CharacterInstance("A", CHARACTERS[0]),
    new CharacterInstance("B", CHARACTERS[1]),
    new CharacterInstance("C", CHARACTERS[2])
  ]

  resetCharacters(){
    this.characterInstances.forEach(character => {
      console.log(character)
    })
  }

  constructor() { }
}
