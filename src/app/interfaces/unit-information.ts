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
    baseMaxHP: number,
    animation: AnimationDetails
}

export interface CharacterInformation extends UnitInformation{
    baseMaxFP: number,
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

export interface EnemyInformation extends UnitInformation{}

export interface CharacterSave {
    experience: number,
    learntFeatures: Set<string>
}