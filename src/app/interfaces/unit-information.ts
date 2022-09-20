import { AnimationDetails } from "./animation-information"
import { Equipment } from "./item-information"
import { SkillInformation as SkillInformation } from "./skill-information"
import { StatArray } from "./stat-information"

export interface EncounterInformation{
    id: string,
    name: string,
    enemies: [EnemyInformation, EnemyInformation, EnemyInformation],
    baseGold: number,
    itemRates: {[id: string]: number}
}

export interface UnitInformation{
    id: string,
    name: string,
    animation: AnimationDetails
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
    statBonuses: StatArray,
    equippedItems: Array<Equipment>
}