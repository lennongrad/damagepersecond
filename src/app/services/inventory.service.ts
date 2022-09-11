import { Injectable } from '@angular/core';
import { EQUIPMENT, ITEMS } from '../data/item-list';
import { Equipment, Item, ItemType } from '../interfaces/item-information';
import { SaveService } from './save.service';
import { UnitInstancesService } from './unit-instances.service';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  gold!: number;
  ownedItems!: Map<string, number>;

  unitInstancesService!: UnitInstancesService;

  goldEarned?: number;
  goldEarnedTotals: Array<number> = [];

  addGold(amount: number): void {
    this.gold += amount;

    if(this.goldEarned == undefined){
      this.goldEarned = 0;
    }
    this.goldEarned += amount;

    this.saveData();
  }

  getItemCount(item: Item): number {
    if (this.ownedItems.has(item.id)) {
      return this.ownedItems.get(item.id)!;
    }
    return 0;
  }

  getItemCost(item: Item): number {
    return item.cost;
  }

  getOwnedItemList(): Array<Item> {
    return _.map(Array.from(this.ownedItems.entries()), item => ITEMS[item[0]]);
  }

  getOwnedEquipmentList(): Array<Equipment> {
    return _.filter(this.getOwnedItemList(), item => item.itemType == ItemType.equipment) as Array<Equipment>;
  }

  getUnequippedEquipment(equipment: Equipment): number {
    var base = this.getItemCount(equipment);
    this.unitInstancesService.characterInstances.forEach(character => {
      if (character.isEquipped(equipment)) {
        base -= 1;
      }
    })
    return base;
  }

  canAffordItem(item: Item): boolean {
    return this.gold >= this.getItemCost(item);
  }

  buyItem(item: Item): void {
    if (this.canAffordItem(item)) {
      this.gold -= this.getItemCost(item);
      if (!this.ownedItems.has(item.id)) {
        this.ownedItems.set(item.id, 0);
      }
      this.ownedItems.set(item.id, this.ownedItems.get(item.id)! + 1);
      this.saveData();
    }
  }

  getGPS(length: number): number {
    var totalGold = 0;
    if (this.goldEarnedTotals.length > 0) {
      totalGold = _.reduce(this.goldEarnedTotals, (memo, num) => memo + num) as number;
      totalGold /= this.goldEarnedTotals.length;
    } else if(this.goldEarned != undefined) {
      totalGold = this.goldEarned;
    }
    return totalGold / length;
  }

  resetTime(): void{
    if(this.goldEarned != undefined){
      this.goldEarnedTotals.push(this.goldEarned);
    }
    this.goldEarned = 0;
  }

  completeReset(): void{
    this.goldEarnedTotals = [];
  }

  saveData(): void {
    this.saveService.saveData("gold-count", this.gold.toString());
    this.saveService.saveData("items-owned", JSON.stringify(Array.from(this.ownedItems.entries())));
  }

  loadData(): void {
    try {
      this.gold = Number(this.saveService.getData("gold-count"));
    } catch {
      this.gold = 0;
    }

    try {
      this.ownedItems = new Map(JSON.parse(this.saveService.getData("items-owned")));
    } catch {
      this.ownedItems = new Map<string, number>();
    }
  }

  constructor(private saveService: SaveService) {
    this.loadData();
  }
}
