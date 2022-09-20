import { Component, OnInit } from '@angular/core';
import { ITEMS, RECIPES } from 'src/app/data/item-list';
import { CraftingRecipe, Item } from 'src/app/interfaces/item-information';
import { BeautifyService } from 'src/app/services/beautify.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { TooltipService } from 'src/app/services/tooltip.service';

@Component({
  selector: 'app-crafting-list',
  templateUrl: './crafting-list.component.html',
  styleUrls: ['./crafting-list.component.less']
})
export class CraftingListComponent implements OnInit {
  getRecipes(): Array<CraftingRecipe> {
    return RECIPES;
  }

  getItem(id: string): Item {
    return ITEMS[id];
  }

  getItemCount(item: Item): number {
    return this.inventoryService.getItemCount(item);
  }

  isCraftable(recipe: CraftingRecipe): boolean {
    return this.inventoryService.isCraftable(recipe);
  }

  craftRecipe(recipe: CraftingRecipe): void {
    this.inventoryService.craftRecipe(recipe);
  }

  beautify(n: number): string {
    return this.beautifyService.beautify(n, true, 3);
  }

  mouseoverItem(event: any, hoveredItem: Item): void {
    this.tooltipService.setItemTooltip(hoveredItem, event.toElement ? event.toElement : event.target, .9);
  }

  mouseoutItem(): void {
    this.tooltipService.setItemTooltip(undefined, undefined, 0);
  }

  constructor(private tooltipService: TooltipService, private beautifyService: BeautifyService, private inventoryService: InventoryService) { }

  ngOnInit(): void {
  }

}
