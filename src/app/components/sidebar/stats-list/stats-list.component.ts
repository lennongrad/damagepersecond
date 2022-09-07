import { Component, OnInit } from '@angular/core';
import { BaseStatTypes, StatDescriptions, StatNames, StatTypeArray } from 'src/app/interfaces/stat-information';
import { BeautifyService } from 'src/app/services/beautify.service';
import { SoundEffectPlayerService } from 'src/app/services/sound-effect-player.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';

@Component({
  selector: 'app-stats-list',
  templateUrl: './stats-list.component.html',
  styleUrls: ['./stats-list.component.less']
})
export class StatsListComponent implements OnInit {
  statNames = StatNames;
  statTypeArray = StatTypeArray;

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
    this.soundPlayerService.playSound(this.soundPlayerService.buttonClickNoise);
  }

  mouseoverStat(event: any, stat: BaseStatTypes): void {
    this.tooltipService.setTextTooltip(StatDescriptions[stat], event.toElement ? event.toElement : event.target, 1);
  }

  mouseoutStat(): void {
    this.tooltipService.setTextTooltip("", undefined, 0);
  }

  constructor(private unitInstancesService: UnitInstancesService,
    private beautifyService: BeautifyService,
    private tooltipService: TooltipService,
    private soundPlayerService: SoundEffectPlayerService) { }

  ngOnInit(): void {
  }

}
