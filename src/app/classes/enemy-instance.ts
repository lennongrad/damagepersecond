import { UnitInstance } from "./unit-instance";
import { EnemyInformation } from "../interfaces/unit-information";
import { UnitInstancesService } from "../services/unit-instances.service";

export class EnemyInstance extends UnitInstance {
    lastDamageReceived = 0;

    difficulty!: number;

    getMaxHP(): number {
        var base = this.enemyInformation.baseMaxHP;
        return base * Math.pow(1.5, this.difficulty - 1);
    }
    getMaxFP(): number {
        return 0;
    }

    override receiveDamage(damage: number): number {
        var damageReceived = super.receiveDamage(damage);

        this.lastDamageReceived = damageReceived;
        //this.unitInstancesService.rewardXP(damageReceived);

        return damageReceived;
    }

    override onDie(): void {
        super.onDie();

        var rewardedExp = this.getMaxHP() * .1 + 5 * (this.difficulty);
        this.unitInstancesService.rewardXP(Math.floor(rewardedExp));
    }

    reconfigure(newInformation: EnemyInformation, assignedDifficulty: number){
        this.enemyInformation = newInformation;
        this.information = newInformation;
        this.difficulty = assignedDifficulty;
    }

    constructor(name: string, public enemyInformation: EnemyInformation, unitInstancesService: UnitInstancesService) {
        super(name, enemyInformation, unitInstancesService);
    }
}