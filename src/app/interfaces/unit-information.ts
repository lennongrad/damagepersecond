import { AnimationDetails } from "./animation-information"

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
    baseMaxFP: number
}

export interface EnemyInformation extends UnitInformation{}

export interface CharacterSave {
    experience: number
}