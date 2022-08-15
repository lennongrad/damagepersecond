import { Injectable } from '@angular/core';
import { EnemyInstance } from '../classes/enemy-instance';
import { ENEMIES } from '../data/enemy-list';
import { CharacterInstancesService } from './character-instances.service';

@Injectable({
  providedIn: 'root'
})
export class EnemyInstancesService {
  enemyInstances: Array<EnemyInstance> = [
    new EnemyInstance("A", ENEMIES[0], this),
    new EnemyInstance("B", ENEMIES[0], this),
    new EnemyInstance("C", ENEMIES[0], this)
  ]

  resetEnemies(): void{
    this.enemyInstances.forEach(enemy => {
      enemy.reset();
    })
  }

  rewardXP(amount: number): void{
    this.characterInstancesService.characterInstances.forEach(character => {
      character.addXP(amount);
    })
  }

  constructor(private characterInstancesService: CharacterInstancesService) { }
}
