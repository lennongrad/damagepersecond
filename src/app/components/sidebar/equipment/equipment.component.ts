import { Component, OnInit } from '@angular/core';
import { Equipment, EquipmentTypeNames, Item } from 'src/app/interfaces/item-information';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.less']
})
export class EquipmentComponent implements OnInit {

  getEquipment(): Array<Equipment>{
    return this.inventoryService.getOwnedEquipmentList();
  }

  equipmentOwned(equipment: Equipment): string{
    return this.inventoryService.getItemCount(equipment).toString();
  }

  getTypes(equipment: Equipment): string{
    return EquipmentTypeNames[equipment.equipmentType];
  }

  mouseoverEquipment(event: any, equipment: Equipment): void{
    return;
  }

  mouseoutEquipment(): void{
    return;
  }

  clickEquipment(equipment: Equipment): void{
    return;
  }

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
  }

}
