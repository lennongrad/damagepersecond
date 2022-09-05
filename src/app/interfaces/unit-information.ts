import { AnimationDetails } from "./animation-information"
import { SkillInformation as SkillInformation } from "./skill-information"

export interface EncounterInformation{
    id: string,
    name: string,
    enemies: [EnemyInformation, EnemyInformation, EnemyInformation]
}

export interface UnitInformation{
    id: string,
    name: string,
    animation: AnimationDetails
}

export enum BaseStatTypes {
    constitution = "CON",
    poise = "POI",
    endurance = "END",
    strength = "STR",
    dexterity = "DEX",
    intelligence = "INT"
}

export interface StatArray {
    CON: number,
    POI: number,
    END: number,
    STR: number,
    DEX: number,
    INT: number
}

export interface CharacterInformation extends UnitInformation{
    baseStats: StatArray,
    characterFeatures: Array<CharacterFeature>,
    defaultSkills: Array<SkillInformation>
}

export interface CharacterFeature{
    expCost: number,
    skillUnlocked?: SkillInformation,
    traitUnlocked?: TraitInformation,
    isGeneric?: boolean
}

export interface TraitInformation{
    id: string,
    name: string,
    icon: string,
    description: string
}

export interface EnemyInformation extends UnitInformation{
    baseMaxHP: number
}

export interface CharacterSave {
    experience: number,
    learntFeatures: Set<string>,
    statBonuses: StatArray
}