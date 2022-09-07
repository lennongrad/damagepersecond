import { Injectable } from '@angular/core';
import { EQUIPMENT, ITEMS } from '../data/item-list';
import { Equipment, Item, ItemType } from '../interfaces/item-information';
import { SaveService } from './save.service';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  gold!: number;
  ownedItems!: Map<string, number>;

  addGold(amount: number): void{
    this.gold += amount;
    this.saveData();
  }
  
  getItemCount(item: Item): number{
    if(this.ownedItems.has(item.id)){
      return this.ownedItems.get(item.id)!;
    }
    return 0;
  }

  getItemCost(item: Item): number{
    return item.cost;
  }
  
  getOwnedItemList(): Array<Item>{
    return _.map(Array.from(this.ownedItems.entries()), item => ITEMS[item[0]]);
  }

  getOwnedEquipmentList(): Array<Equipment>{
    return _.filter(this.getOwnedItemList(), item => item.itemType == ItemType.equipment) as Array<Equipment>;
  }

  canAffordItem(item: Item): boolean{
    return this.gold >= this.getItemCost(item);
  }

  buyItem(item: Item): void{
    if(this.canAffordItem(item)){
      this.gold -= this.getItemCost(item);
      if(!this.ownedItems.has(item.id)){
        this.ownedItems.set(item.id, 0);
      }
      this.ownedItems.set(item.id, this.ownedItems.get(item.id)! + 1);
      this.saveData();
    }
  }

  saveData(): void {
    this.saveService.saveData("gold-count", this.gold.toString());
    this.saveService.saveData("items-owned", JSON.stringify(Array.from(this.ownedItems.entries())));
  }

  loadData(): void {
    try{
      this.gold = Number(this.saveService.getData("gold-count"));
    } catch{
      this.gold = 0;
    }

    try{
      this.ownedItems = new Map(JSON.parse(this.saveService.getData("items-owned")));
    } catch{
      this.ownedItems = new Map<string, number>();
    }
  }

  constructor(private saveService: SaveService) {
    this.loadData();
  }
}
