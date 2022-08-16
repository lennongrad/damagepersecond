import { UnitInstance } from "./unit-instance";
import { EnemyInformation } from "../interfaces/unit-information";
import { UnitInstancesService } from "../services/unit-instances.service";

export class EnemyInstance extends UnitInstance{
    getMaxHP(): number{
        return this.enemyInformation.baseMaxHP;
    }
    getMaxFP(): number{
        return 0;
    }

    override onDie(): void{
        super.onDie();
        this.unitInstancesService.rewardXP(10);
    }

    constructor(name: string, public enemyInformation: EnemyInformation, unitInstancesService: UnitInstancesService){
        super(name, enemyInformation, unitInstancesService);
    }
}