import { Component, OnInit } from '@angular/core';
import { EQUIPMENT, STOREITEMS } from 'src/app/data/item-list';
import { Equipment, EquipmentTypeNames, Item, ItemType } from 'src/app/interfaces/item-information';
import { BeautifyService } from 'src/app/services/beautify.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { SoundEffectPlayerService } from 'src/app/services/sound-effect-player.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.less']
})
export class StoreComponent implements OnInit {
  sortBy: string = "cost";
  ascending = true;

  selectSort(sortType: string): void{
    if(this.sortBy == sortType){
      this.ascending = !this.ascending;
    } else {
      this.sortBy = sortType;
    }
  }

  getItems(): Array<Item>{
    var baseList = _.sortBy(STOREITEMS, this.sortBy);
    if(!this.ascending){
      return baseList.reverse();
    }
    return baseList;
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

  getWeight(item: Item): number{
    if(item.itemType != ItemType.equipment){
      return 0;
    }
    return (item as Equipment).weight;
  }

  mouseoverItem(event: any, item: Item): void{
    this.tooltipService.setItemTooltip(item, event.toElement ? event.toElement : event.target, 1);
  }

  mouseoutItem(): void{
    this.tooltipService.setItemTooltip(undefined, undefined, 0);
  }

  clickItem(item: Item): void{
    this.inventoryService.buyItem(item);
    this.soundEffectPlayer.playSound(this.soundEffectPlayer.trackPingNoise);
  }

  constructor(private inventoryService: InventoryService,
    private beautifyService: BeautifyService,
    private soundEffectPlayer: SoundEffectPlayerService,
    private tooltipService: TooltipService) { }

  ngOnInit(): void {
  }

}
