import { Subject } from "rxjs";
import { UnitInstance } from "./unit-instance";
import { EnemyInformation } from "../interfaces/unit-information";
import { AnimationDetails } from "../interfaces/animation-information";
import { EnemyInstancesService } from "../services/enemy-instances.service";

export class EnemyInstance extends UnitInstance{
    getMaxHP(): number{
        return this.enemyInformation.baseMaxHP;
    }
    getMaxFP(): number{
        return 0;
    }

    override onDie(): void{
        super.onDie();
        this.enemyInstancesService.rewardXP(10);
    }

    constructor(name: string, public enemyInformation: EnemyInformation, private enemyInstancesService: EnemyInstancesService){
        super(name, enemyInformation);
    }
}