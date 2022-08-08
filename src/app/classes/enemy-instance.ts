import { Subject } from "rxjs";
import { EnemyInformation } from "../interfaces/enemy-information";
import { AnimationDetails } from "../interfaces/animation-information";

export class EnemyInstance {
    animationChange = new Subject<string>();

    getAnimationDetails(): AnimationDetails {
        return this.enemyInformation.enemyAnimation;
    }

    playAnimation(name: string) {
        this.animationChange.next(name);
    }

    constructor(public name: string, public enemyInformation: EnemyInformation){}
}