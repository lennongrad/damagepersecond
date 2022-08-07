import { Subject } from "rxjs";
import { AnimationInformation, AnimationDetails } from "../interfaces/animation-information";

export class EnemyInstance {
    animationChange = new Subject<string>();

    idleAnimation: AnimationInformation = {
        name: "Idle", repeat: true, randomize: .1, frameDurations: [
            { duration: 8, frame: { x: 0, y: 0 } },
            { duration: .1, frame: { x: 1, y: 0 } },
            { duration: .2, frame: { x: 2, y: 0 } },
            { duration: .1, frame: { x: 1, y: 0 } },
            { duration: .06, frame: { x: 2, y: 2 } }
        ]
    }
    attackAnimation: AnimationInformation = {
        name: "Attack", repeat: false, returnTo: "Idle", frameDurations: [
            { duration: .02, frame: { x: 0, y: 1 } },
            { duration: .04, frame: { x: 1, y: 1 } },
            { duration: .04, frame: { x: 2, y: 1 } },
            { duration: .16, frame: { x: 3, y: 1 } },
            { duration: .08, frame: { x: 4, y: 1 } },
            { duration: .04, frame: { x: 5, y: 1 } },
            { duration: .08, frame: { x: 6, y: 1 } },
            { duration: .02, frame: { x: 7, y: 1 } },
            { duration: .02, frame: { x: 1, y: 2 } },
            { duration: .04, frame: { x: 2, y: 2 } }
        ]
    }
    damageAnimation: AnimationInformation = {
        name: "Damage", repeat: false, returnTo: "Idle", frameDurations: [
            { duration: .02, frame: { x: 4, y: 0 } },
            { duration: .3, frame: { x: 3, y: 0 } },
        ]
    }

    getAnimationDetails(): AnimationDetails {
        return {
            imageURL: "enemy-test.png",
            sheetWidth: 8,
            sheetHeight: 8,
            animations: [this.idleAnimation, this.attackAnimation, this.damageAnimation]
        };
    }

    playAnimation(name: string) {
        this.animationChange.next(name);
    }
}