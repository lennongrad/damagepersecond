import { Subject } from "rxjs";
import { AnimationDetails } from "../interfaces/animation-information";
import { CharacterInformation } from "../interfaces/character-information";

export class CharacterInstance {
    animationChange = new Subject<string>();

    getAnimationDetails(): AnimationDetails {
        return this.characterInformation.characterAnimation;
    }

    playAnimation(name: string) {
        this.animationChange.next(name);
    }

    constructor(public name: string, public characterInformation: CharacterInformation) {

    }
}