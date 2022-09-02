import { Subject } from "rxjs";
import { StatusInformation, Status, StatusType, StackType } from "../interfaces/status-information";
import { UnitInformation } from "../interfaces/unit-information";
import { AnimationDetails } from "../interfaces/animation-information";
import * as _ from 'underscore';
import { UnitInstancesService } from "../services/unit-instances.service";
import { DamageType, SkillContext } from "../interfaces/skill-information";

export abstract class UnitInstance {
    animationChange = new Subject<string>();
    tickChange = new Subject<number | true>();
    statuses = new Array<Status>();
    hp = 0;
    fp = 0;

    abstract getMaxHP(): number;
    abstract getMaxFP(): number;

    getHP(): number {
        return Math.floor(this.hp * 100) / 100;
    }
    getFP(): number {
        return Math.floor(this.fp * 100) / 100;
    }

    getStatusesByType(type: StatusType): Array<Status> {
        return _.filter(this.statuses, status => status.statusInformation.type == type);
    }

    isAlive(): boolean {
        return this.hp > 0.01;
    }

    onDie(): void {
        this.statuses = [];
    }

    playAnimation(name: string): void {
        this.animationChange.next(name);
    }

    getAnimationDetails(): AnimationDetails {
        return this.information.animation;
    }

    getFPCost(skillContext: SkillContext): number {
        var baseCost = skillContext.skill.skillInfo.fpCost != undefined ? skillContext.skill.skillInfo.fpCost : 0;
        baseCost *= skillContext.fpMultiplier;
        return baseCost;
    }

    canAfford(skillContext: SkillContext): boolean {
        return this.getFPCost(skillContext) <= this.fp;
    }

    spendFP(skillContext: SkillContext): void {
        this.fp -= this.getFPCost(skillContext);
    }

    dealDamage(skillContext: SkillContext, target: UnitInstance, baseDamage: number,
        baseDirectHit: number = 0, baseCriticalHit: number = 0): number {
        var copiedContext = Object.assign({}, skillContext);
        this.forEachStatus((status) => {
            if (status.statusInformation.onDamageDeal != undefined) {
                status.statusInformation.onDamageDeal(status, copiedContext, this, target);
            }
        })
        target.forEachStatus((status) => {
            if (status.statusInformation.onDamageReceive != undefined) {
                status.statusInformation.onDamageReceive(status, copiedContext, this, target);
            }
        })

        var hitRoll = Math.ceil(Math.random() * 100);
        skillContext.damageType = DamageType.normal;
        if (hitRoll < baseCriticalHit + copiedContext.criticalRateAddition) {
            copiedContext.damageMultiplier += copiedContext.criticalDamageAddition / 100 + 1.5
            skillContext.damageType = DamageType.critical;
        } else if (hitRoll < baseDirectHit + copiedContext.directRateAddition) {
            copiedContext.damageMultiplier += copiedContext.directDamageAddition / 100 + .25
            skillContext.damageType = DamageType.direct;
        }

        var damageToDeal = (baseDamage + copiedContext.baseDamageAddition) * copiedContext.damageMultiplier;
        damageToDeal = Math.floor(damageToDeal * 100) / 100;

        target.receiveDamage(damageToDeal);

        skillContext.damageDealt += damageToDeal;

        return damageToDeal;
    }

    receiveDamage(damage: number): number {
        var wasAlive = this.isAlive();

        var dealtDamage = this.hp - Math.max(this.hp - damage, 0);
        dealtDamage = Math.floor(dealtDamage * 100) / 100;

        if (dealtDamage > 0) {
            this.hp -= dealtDamage;
            this.tickChange.next(-dealtDamage);
        }

        if (!this.isAlive() && wasAlive) {
            this.onDie();
        }

        return dealtDamage;
    }

    healDamage(damage: number): number {
        var healedDamage = Math.min(this.hp + damage, this.getMaxHP()) - this.hp;
        this.hp += healedDamage;
        this.tickChange.next(healedDamage);
        return healedDamage;
    }

    addStatus(status: Status): void {
        if (status.duration != undefined) {
            status.duration += 1;
        }

        var existingStatus = _.findWhere(this.statuses, { statusInformation: status.statusInformation })

        if (existingStatus == undefined || status.statusInformation.stackType == StackType.keepBoth) {
            this.statuses.push(status);
        } else {
            switch (status.statusInformation.stackType) {
                case StackType.add:
                    if (existingStatus.degree != undefined) existingStatus.degree += status.degree ? status.degree : 0;
                    break;
                case StackType.keepHighest:
                    existingStatus.degree = Math.max(status.degree ? status.degree : 0, existingStatus.degree ? existingStatus.degree : 0);
                    break;
                case StackType.replace:
                    existingStatus.degree = status.degree;
                    break;
            }
        }
    }

    timeIncrement(): void {
        this.forEachStatus((status) => {
            if (status.duration != undefined) {
                status.duration -= 1;
            }
            if (status.statusInformation.onTimeIncrement != undefined) {
                status.statusInformation.onTimeIncrement(status, this);
            }
        })
        this.statuses = _.filter(this.statuses, (status) => status.duration != undefined ? status.duration > 0 : true)
    }

    timeNoSkill(): void {
        this.forEachStatus((status) => {
            if (status.statusInformation.onNoSkill != undefined) {
                status.statusInformation.onNoSkill(status, this);
            }
        })
    }

    forEachStatus(callback: (status: Status) => void): void {
        this.statuses.forEach((status) => callback(status));
        this.statuses = _.filter(this.statuses, (status) => status.duration != undefined ? status.duration > 0 : true)
    }

    reset(): void {
        this.hp = this.getMaxHP();
        this.fp = this.getMaxFP();
        this.statuses = [];
        this.tickChange.next(true);
    }

    completeReset(): void {
        return;
    }

    constructor(name: string, public information: UnitInformation, public unitInstancesService: UnitInstancesService) { }
}