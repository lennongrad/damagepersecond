import { UnitInstance } from "./unit-instance";
import { EnemyInformation } from "../interfaces/unit-information";
import { UnitInstancesService } from "../services/unit-instances.service";

export class EnemyInstance extends UnitInstance {
    getMaxHP(): number {
        return this.enemyInformation.baseMaxHP;
    }
    getMaxFP(): number {
        return 0;
    }

    lastDamageReceived = 0;

    override receiveDamage(damage: number): number {
        var damageReceived = super.receiveDamage(damage);

        this.lastDamageReceived = damageReceived;
        //this.unitInstancesService.rewardXP(damageReceived);

        return damageReceived;
    }

    override onDie(): void {
        super.onDie();
        this.unitInstancesService.rewardXP(this.getMaxHP() * .1 + this.lastDamageReceived);
    }

    constructor(name: string, public enemyInformation: EnemyInformation, unitInstancesService: UnitInstancesService) {
        super(name, enemyInformation, unitInstancesService);
    }
}