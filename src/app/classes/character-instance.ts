import { Subject } from "rxjs";
import { AnimationInformation, AnimationDetails } from "../interfaces/animation-information";

export class CharacterInstance {
    animationChange = new Subject<string>();

    idleAnimation: AnimationInformation = {
        name: "Idle", repeat: true, randomize: .01, frameDurations: [
            { duration: 12, frame: { x: 0, y: 0 } },
            { duration: .1, frame: { x: 1, y: 0 } },
            { duration: .3, frame: { x: 2, y: 0 } },
            { duration: .6, frame: { x: 3, y: 0 } },
            { duration: .2, frame: { x: 1, y: 0 } }
        ]
    }
    attackAnimation: AnimationInformation = {
        name: "Attack", repeat: false, returnTo: "Idle", frameDurations: [
            { duration: .04, frame: { x: 1, y: 0 } },
            { duration: .04, frame: { x: 0, y: 1 } },
            { duration: .08, frame: { x: 1, y: 1 } },
            { duration: .1, frame: { x: 2, y: 1 } },
            { duration: .04, frame: { x: 3, y: 1 } },
            { duration: .04, frame: { x: 4, y: 1 } },
            { duration: .04, frame: { x: 5, y: 1 } }
        ]
    }
    damageAnimation: AnimationInformation = {
        name: "Damage", repeat: false, returnTo: "Idle", frameDurations: [
            { duration: .02, frame: { x: 0, y: 2 } },
            { duration: .04, frame: { x: 1, y: 2 } },
            { duration: .04, frame: { x: 2, y: 2 } },
            { duration: .08, frame: { x: 3, y: 2 } },
            { duration: .08, frame: { x: 4, y: 2 } },
            { duration: .3, frame: { x: 3, y: 0 } },
        ]
    }


    getAnimationDetails(): AnimationDetails {
        return {
            imageURL: "eirika-test.png",
            sheetWidth: 8,
            sheetHeight: 8,
            animations: [this.idleAnimation, this.attackAnimation, this.damageAnimation]
        };
    }

    playAnimation(name: string) {
        this.animationChange.next(name);
    }

    constructor(public name: string) {

    }
}