import { Injectable } from '@angular/core';
import { EnemyInstance } from '../classes/enemy-instance';
import { ENEMIES } from '../data/enemy-list';

@Injectable({
  providedIn: 'root'
})
export class EnemyInstancesService {
  enemyInstances: Array<EnemyInstance> = [
    new EnemyInstance("A", ENEMIES[0]),
    new EnemyInstance("B", ENEMIES[0]),
    new EnemyInstance("C", ENEMIES[0])
  ]

  constructor() { }
}
