import { Component, OnInit } from '@angular/core';
import { BaseStatTypes } from 'src/app/interfaces/unit-information';
import { BeautifyService } from 'src/app/services/beautify.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';

@Component({
  selector: 'app-stats-list',
  templateUrl: './stats-list.component.html',
  styleUrls: ['./stats-list.component.less']
})
export class StatsListComponent implements OnInit {
  public baseStatTypes = [
    BaseStatTypes.constitution, 
    BaseStatTypes.poise, 
    BaseStatTypes.endurance, 
    BaseStatTypes.strength, 
    BaseStatTypes.dexterity, 
    BaseStatTypes.intelligence
  ];

  public statNames: {[statID: string]: string} = {
    "CON": "Constitution",
    "POI": "Poise",
    "END": "Endurance",
    "STR": "Strength",
    "DEX": "Dexterity",
    "INT": "Intelligence"
  }

  public statDescriptions: {[statID: string]: string} = {
    "CON": "Determines your maximum HP and thus how much damage you can take.",
    "POI": "Determines your maximum FP and thus how many special skills you can use.",
    "END": "Determines your carrying capacity and thus how many pieces of equipment you can handle.",
    "STR": "Your <b>STR</b> modifier is added each time you damage an enemy with a <i>physical</i> attack skill.",
    "DEX": "Your <b>DEX</b> modifier is added each time you damage an enemy with a <i>finesse</i> attack skill.",
    "INT": "Your <b>INT</b> modifier is added each time you damage an enemy with a <i>magical</i> attack skill.",
  }

  showModifier(stat: BaseStatTypes): boolean{
    return [BaseStatTypes.strength, BaseStatTypes.dexterity, BaseStatTypes.intelligence].includes(stat);
  }

  getStat(stat: BaseStatTypes): string{
    return this.unitInstancesService.selectedCharacter.getStat(stat, false).toString();
  }

  getModifier(stat: BaseStatTypes): string{
    var base = this.unitInstancesService.selectedCharacter.getStatModifier(stat, false);
    if(base > 0){
      return "+" + base.toString();
    }
    return base.toString();
  }

  beautify(value: number): string {
    return this.beautifyService.beautify(value, true);
  }

  getStatCost(stat: BaseStatTypes): number{
    return this.unitInstancesService.selectedCharacter.getStatCost(stat);
  }

  isStatAffordable(stat: BaseStatTypes): boolean{
    return this.unitInstancesService.selectedCharacter.canAffordStat(stat);
  }

  clickStat(stat: BaseStatTypes): void{
    this.unitInstancesService.selectedCharacter.buyStat(stat);
  }

  mouseoverStat(event: any, stat: BaseStatTypes): void {
    this.tooltipService.setTextTooltip(this.statDescriptions[stat], event.toElement ? event.toElement : event.target, 1);
  }

  mouseoutStat(): void {
    this.tooltipService.setTextTooltip("", undefined, 0);
  }

  constructor(private unitInstancesService: UnitInstancesService,
    private beautifyService: BeautifyService,
    private tooltipService: TooltipService) { }

  ngOnInit(): void {
  }

}
