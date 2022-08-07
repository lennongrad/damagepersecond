import { Injectable } from '@angular/core';
import { EnemyInstance } from '../classes/enemy-instance';

@Injectable({
  providedIn: 'root'
})
export class EnemyInstancesService {
  enemyInstances: Array<EnemyInstance> = [
    new EnemyInstance(),
    new EnemyInstance(),
    new EnemyInstance()
  ]

  constructor() { }
}
