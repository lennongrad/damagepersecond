import { Subject } from "rxjs";
import { UnitInstance } from "./unit-instance";
import { AnimationDetails } from "../interfaces/animation-information";
import { CharacterInformation, CharacterSave } from "../interfaces/unit-information";
import { CharacterInstancesService } from "../services/character-instances.service";

export class CharacterInstance extends UnitInstance {
    permanentData!: CharacterSave;

    getMaxHP(): number {
        return this.characterInformation.baseMaxHP;
    }
    getMaxFP(): number {
        return this.characterInformation.baseMaxFP;
    }
    getXP(): number {
        return this.permanentData.experience;
    }

    addXP(amount: number): void{
        this.permanentData.experience += amount;
        this.saveData();
    }

    saveData(): void{
        this.characterInstancesService.saveData(this);
    }

    loadData(): void {
        var loadedData = this.characterInstancesService.loadData(this);
        if(loadedData != undefined){
            this.permanentData = loadedData;
        } else {
            this.permanentData = { experience: 0 };
        }
    }

    constructor(name: string, public characterInformation: CharacterInformation, private characterInstancesService: CharacterInstancesService) {
        super(name, characterInformation);

        this.loadData();
    }
}