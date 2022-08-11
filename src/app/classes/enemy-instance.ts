import { Subject } from "rxjs";
import { EnemyInformation } from "../interfaces/enemy-information";
import { AnimationDetails } from "../interfaces/animation-information";

export class EnemyInstance {
    animationChange = new Subject<string>();
    hp = 0;

    getMaxHP(): number{
        return this.enemyInformation.maxHP;
    }

    isAlive(): boolean{
        return this.hp > 0;
    }

    getAnimationDetails(): AnimationDetails {
        return this.enemyInformation.enemyAnimation;
    }

    playAnimation(name: string): void {
        this.animationChange.next(name);
    }

    resetEnemy(): void{
        this.hp = this.getMaxHP();
    }

    dealDamage(damage: number): void{
        this.hp -= damage;
    }

    constructor(public name: string, public enemyInformation: EnemyInformation){}
}