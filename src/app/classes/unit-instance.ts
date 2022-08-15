import { Subject } from "rxjs";
import { StatusInformation, Status, StatusType } from "../interfaces/status-information";
import { UnitInformation } from "../interfaces/unit-information";
import { AnimationDetails } from "../interfaces/animation-information";
import * as _ from 'underscore';

export abstract class UnitInstance {
    animationChange = new Subject<string>();
    tickChange = new Subject<number | true>();
    statuses = new Array<Status>();
    hp = 0;
    fp = 0;

    abstract getMaxHP(): number;
    abstract getMaxFP(): number;

    getStatusesByType(type: StatusType): Array<Status> {
        return _.filter(this.statuses, status => status.statusInformation.type == type);
    }

    isAlive(): boolean {
        return this.hp > 0;
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

    dealDamage(damage: number): number {
        var wasAlive = this.isAlive();

        var dealtDamage = this.hp - Math.max(this.hp - damage, 0);
        this.hp -= dealtDamage;
        this.tickChange.next(-dealtDamage);

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
        if (_.some(this.statuses, { statusInformation: status.statusInformation })) {
            //this.statuses.set(status.statusInformation, status);
        } else {
            this.statuses.push(status);
        }
    }

    reset(): void {
        this.hp = this.getMaxHP();
        this.fp = this.getMaxFP();
        this.statuses = [];
        this.tickChange.next(true);
    }

    constructor(name: string, public information: UnitInformation) { }
}