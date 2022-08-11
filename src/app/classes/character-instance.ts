import { Subject } from "rxjs";
import { AnimationDetails } from "../interfaces/animation-information";
import { CharacterInformation } from "../interfaces/character-information";

export class CharacterInstance {
    animationChange = new Subject<string>();
    hp = 0;
    fp = 0;

    getMaxHP(): number {
        return this.characterInformation.baseMaxHP;
    }
    getMaxFP(): number {
        return this.characterInformation.baseMaxFP;
    }
    getXP(): number {
        return 10;
    }

    isAlive(): boolean {
        return this.hp > 0;
    }

    getAnimationDetails(): AnimationDetails {
        return this.characterInformation.characterAnimation;
    }

    playAnimation(name: string): void {
        this.animationChange.next(name);
    }

    resetCharacter(): void {
        this.hp = this.getMaxHP();
        this.fp = this.getMaxFP();
    }

    dealDamage(damage: number): void {
        this.hp -= damage;
    }

    constructor(public name: string, public characterInformation: CharacterInformation) {

    }
}