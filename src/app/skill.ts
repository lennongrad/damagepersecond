import { CharacterInstance } from "./character-instance";

export interface Skill {
    id?: number;
    icon: string;
    name: string;
    flavour: string;
    effect: (character: CharacterInstance) => void;
    description: () => string;
}