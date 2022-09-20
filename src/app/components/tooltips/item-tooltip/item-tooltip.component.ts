import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Equipment, getItemType, Item, ItemType } from 'src/app/interfaces/item-information';
import { BaseStatTypes, StatBonuses, StatNames } from 'src/app/interfaces/stat-information';
import { BeautifyService } from 'src/app/services/beautify.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrls: ['./item-tooltip.component.less']
})
export class ItemTooltipComponent implements OnInit {
  @ViewChild('tooltipbox') tooltipBox!: ElementRef;
  @Input() isMain: boolean = false;

  hoveredItem?: Item;
  element?: Element;
  opacity = 1;

  pressedKeys: { [keycode: string]: boolean } = {};
  @HostListener('window:keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) { this.pressedKeys[event.key] = true }
  @HostListener('document:keyup', ['$event'])
  onKeyDown(event: KeyboardEvent) { this.pressedKeys[event.key] = false; }

  // calculated so that the tooltip is not offscreen
  topOffset = -1000;
  leftOffset = -1000;

  getType(): string {
    if (this.hoveredItem == undefined) {
      return "";
    }
    return getItemType(this.hoveredItem);
  }

  getBonuses(): Array<any> {
    if (this.hoveredItem == undefined || this.hoveredItem.itemType != ItemType.equipment) {
      return [];
    }

    var bonuses = (this.hoveredItem as Equipment).statBonuses;
    return _.map(Object.keys(bonuses), key => {
      var val = bonuses[key as BaseStatTypes];
      return {
        statName: key,
        value: ((val != undefined && val >= 0) ? "+" : "") + val?.toString(),
        negative: val != undefined && val < 0
      }
    });
  }

  getWeight(): number{
    if (this.hoveredItem == undefined || this.hoveredItem.itemType != ItemType.equipment) {
      return 0;
    }

    return (this.hoveredItem as Equipment).weight;
  }

  getSellCost(): string{
    if(this.hoveredItem == undefined){
      return "";
    }
    return this.beautifyService.beautify(this.inventoryService.getItemSellCost(this.hoveredItem), true, 4);
  }

  update() {
    if (this.element != undefined && this.tooltipBox != undefined) {
      var elementRect = this.element.getBoundingClientRect();
      this.leftOffset = elementRect.x + elementRect.width;

      if (this.tooltipBox != undefined) {
        var tooltipRect = this.tooltipBox.nativeElement.getBoundingClientRect();
        if (this.leftOffset + tooltipRect.width > document.body.clientWidth) {
          this.leftOffset = document.body.clientWidth - tooltipRect.width - 8;
        }
      }

      this.topOffset = elementRect.y + elementRect.height;
    }
  }

  constructor(private tooltipService: TooltipService, private inventoryService: InventoryService, private beautifyService: BeautifyService) {
  }

  ngOnInit(): void {
    if(this.isMain){
      this.tooltipService.itemTooltip = this;
    }
  }

}
