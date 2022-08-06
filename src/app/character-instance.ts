import { Subject } from "rxjs";
import { AnimationInformation } from './animation-information';

export class CharacterInstance {
    animationChange = new Subject<string>();

    getAnimationDetails(): Array<AnimationInformation> {
        return [
            { 
                name: "Idle", repeat: true, randomize: .01, frameDurations: [
                    { duration: 4, frame: { x: 1, y: 0 } },
                    { duration: .5, frame: { x: 0, y: 0 } }/*,
                    { duration: 32, frame: { x: 2, y: 1 } },
                    { duration: 256, frame: { x: 2, y: 0 } },
                    { duration: 32, frame: { x: 2, y: 1 } },
                    { duration: 32, frame: { x: 0, y: 0 } }*/
                ]
            }, {
                name: "Attack", repeat: false, returnTo: "Idle", frameDurations: [
                    { duration: .01, frame: { x: 1, y: 3 } },
                    { duration: .02, frame: { x: 0, y: 1 } },
                    { duration: .02, frame: { x: 1, y: 1 } },
                    { duration: .03, frame: { x: 0, y: 2 } },
                    { duration: .05, frame: { x: 1, y: 2 } },
                    { duration: .02, frame: { x: 2, y: 2 } },
                    { duration: .01, frame: { x: 0, y: 3 } }
                ]
            }
        ];
    }

    playAnimation(name: string) {
        this.animationChange.next(name);
    }

    constructor(public name: string){

    }
}