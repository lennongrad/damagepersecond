import { Injectable } from '@angular/core';
import { CharacterInstance } from '../classes/character-instance';

@Injectable({
  providedIn: 'root'
})
export class CharacterInstancesService {
  characterInstances: Array<CharacterInstance> = [
    new CharacterInstance("A"),
    new CharacterInstance("B"),
    new CharacterInstance("C")
  ]

  constructor() { }
}
