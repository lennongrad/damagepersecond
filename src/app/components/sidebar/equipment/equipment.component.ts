import { Component, OnInit } from '@angular/core';
import { CharacterInstance } from 'src/app/classes/character-instance';
import { Equipment, EquipmentTypeNames, Item } from 'src/app/interfaces/item-information';
import { BaseStatTypes, StatDescriptions, StatTypeArray } from 'src/app/interfaces/stat-information';
import { InventoryService } from 'src/app/services/inventory.service';
import { SoundEffectPlayerService } from 'src/app/services/sound-effect-player.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.less']
})
export class EquipmentComponent implements OnInit {
  statTypeArray = StatTypeArray;

  sortBy?: string;
  ascending = true;

  selectSort(sortType: string): void{
    if(this.sortBy == sortType){
      this.ascending = !this.ascending;
    } else {
      this.sortBy = sortType;
    }
  }

  getSelectedCharacter(): CharacterInstance {
    return this.unitInstancesService.selectedCharacter;
  }

  isEquipped(equipment: Equipment): boolean {
    return this.getSelectedCharacter().isEquipped(equipment);
  }

  getEquipment(): Array<Equipment> {
    var baseList = _.sortBy(this.inventoryService.getOwnedEquipmentList(), this.sortBy);
    if(!this.ascending){
      baseList = baseList.reverse();
    }
    return baseList;
  }

  getEncumberance(): number {
    return this.getSelectedCharacter().getEncumberance();
  }

  getCapacity(): number {
    return this.getSelectedCharacter().getCarryingCapacity();
  }

  getCapacityVisual(): string{
    var base = "";
    for(var i = 0; i < (this.getCapacity() - this.getEncumberance()); i++){
      base += "○ ";
    }
    for(var i = 0; i < this.getEncumberance(); i++){
      base += "● ";
    }

    return base;
  }

  equipmentOwned(equipment: Equipment): string {
    var base = this.inventoryService.getItemCount(equipment).toString();
    var unequipped = this.inventoryService.getUnequippedEquipment(equipment).toString();
    if(unequipped != base){
      base = unequipped + "/" + base;
    }
    return base;
  }

  getTypes(equipment: Equipment): string {
    return EquipmentTypeNames[equipment.equipmentType];
  }

  getStatValue(stat: BaseStatTypes): string{
    return this.getSelectedCharacter().getStat(stat).toString();
  }

  getWeight(equipment: Equipment){
    var baseString = "";
    for (var i = 0; i < equipment.weight; i++) {
      baseString += "●";
    }
    return baseString;
  }

  getStatModifier(stat: BaseStatTypes): string{
    var modifier = this.getSelectedCharacter().getStatModifier(stat);
    if(modifier != 0 && [BaseStatTypes.strength,, BaseStatTypes.dexterity, BaseStatTypes.intelligence].includes(stat)){
      return (modifier >= 0 ? "+" : "") + modifier.toString();
    }
    return "";
  }

  canEquip(equipment: Equipment): boolean{
    return this.getSelectedCharacter().canEquip(equipment);
  }

  mouseoverStat(event: any, stat: BaseStatTypes): void {
    this.tooltipService.setTextTooltip(StatDescriptions[stat],  event.toElement ? event.toElement : event.target, 1);
  }

  mouseoutStat(): void {
    this.tooltipService.setTextTooltip("", undefined, 0);
  }

  mouseoverEquipment(event: any, equipment: Equipment): void{
    this.tooltipService.setItemTooltip(equipment, event.toElement ? event.toElement.parentElement : event.target.parentElement, 1);
  }

  mouseoutEquipment(): void{
    this.tooltipService.setItemTooltip(undefined, undefined, 0);
  }

  clickEquipment(equipment: Equipment): void {
    if (this.getSelectedCharacter().isEquipped(equipment)) {
      this.getSelectedCharacter().unequipEquipment(equipment);
    } else {
      this.getSelectedCharacter().equipEquipment(equipment);
    }
    this.soundEffectPlayer.playSound(this.soundEffectPlayer.trackPingNoise);
  }

  constructor(private inventoryService: InventoryService,
    private unitInstancesService: UnitInstancesService,
    private soundEffectPlayer: SoundEffectPlayerService,
    private tooltipService: TooltipService) { }

  ngOnInit(): void {
  }

}
