import { Component, OnInit } from '@angular/core';
import { EQUIPMENT, STOREITEMS } from 'src/app/data/item-list';
import { Equipment, EquipmentTypeNames, Item } from 'src/app/interfaces/item-information';
import { BeautifyService } from 'src/app/services/beautify.service';
import { InventoryService } from 'src/app/services/inventory.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.less']
})
export class StoreComponent implements OnInit {

  getItems(): Array<Item>{
    return _.sortBy(STOREITEMS, 'cost');
  }

  itemsOwned(item: Item): number{
    return this.inventoryService.getItemCount(item);
  }

  isItemAffordable(item: Item): boolean{
    return this.inventoryService.canAffordItem(item);
  }

  getItemCost(item: Item): string{
    return this.beautifyService.beautify(this.inventoryService.getItemCost(item), true);
  }

  getTypes(item: Item): string{
    var equipment = item as Equipment;
    if(equipment.equipmentType != undefined){
      return EquipmentTypeNames[equipment.equipmentType];
    }
    return "";
  }

  mouseoverItem(event: any, item: Item): void{
    return;
  }

  mouseoutItem(): void{
    return;
  }

  clickItem(item: Item): void{
    this.inventoryService.buyItem(item);
  }

  constructor(private inventoryService: InventoryService,
    private beautifyService: BeautifyService) { }

  ngOnInit(): void {
  }

}
