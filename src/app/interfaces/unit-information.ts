import { AnimationDetails } from "./animation-information"

export interface UnitInformation{
    name: string,
    baseMaxHP: number,
    animation: AnimationDetails
}

export interface CharacterInformation extends UnitInformation{
    baseMaxFP: number
}

export interface EnemyInformation extends UnitInformation{}

export interface CharacterSave {
    experience: number
}