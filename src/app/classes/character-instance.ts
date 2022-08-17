import { UnitInstance } from "./unit-instance";
import { CharacterInformation, CharacterSave } from "../interfaces/unit-information";
import { UnitInstancesService } from "../services/unit-instances.service";
import { SkillContext } from "../interfaces/skill-information";
import * as _ from 'underscore';

export class CharacterInstance extends UnitInstance {
    permanentData!: CharacterSave;

    currentDamageDealt = 0;
    finalDamages = Array<number>();

    getMaxHP(): number {
        return this.characterInformation.baseMaxHP;
    }
    getMaxFP(): number {
        return this.characterInformation.baseMaxFP;
    }
    getXP(): number {
        return this.permanentData.experience;
    }
    getDPR(length: number): number {
        var totalDamage = 0;
        if (this.finalDamages.length > 0) {
            totalDamage = _.reduce(this.finalDamages, (memo, num) => memo + num) as number;
            totalDamage /= this.finalDamages.length;
        } else {
            totalDamage = this.currentDamageDealt;
        }
        return totalDamage / length;
    }

    addXP(amount: number): void {
        this.permanentData.experience += amount;
        this.saveData();
    }

    saveData(): void {
        this.unitInstancesService.saveData(this);
    }

    loadData(): void {
        var loadedData = this.unitInstancesService.loadData(this);
        if (loadedData != undefined) {
            this.permanentData = loadedData;
        } else {
            this.permanentData = { experience: 0 };
        }
    }

    override dealDamage(skillContext: SkillContext, target: UnitInstance, baseDamage: number,
        directRate: number = 0, criticalRate: number = 0): number {
        var damageDealt = super.dealDamage(skillContext, target, baseDamage, directRate, criticalRate);

        this.currentDamageDealt += damageDealt;

        return damageDealt;
    }

    override reset(): void {
        super.reset();
        this.finalDamages.push(this.currentDamageDealt);
        this.currentDamageDealt = 0;
    }

    override completeReset(): void {
        super.completeReset();
        this.finalDamages = [];
    }

    constructor(name: string,
        public characterInformation: CharacterInformation,
        unitInstancesService: UnitInstancesService) {
        super(name, characterInformation, unitInstancesService);

        this.loadData();
    }
}